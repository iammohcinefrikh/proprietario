import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { startOfMonth, endOfMonth, getYear, setMonth } from "date-fns";

import handleResponse from "../helpers/handleResponseHelper";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

interface RequestWithUser extends Request {
  user?: any;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getStats = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;

    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());
    const currentYear = getYear(new Date());
    const monthlyReport = [];

    const unitsCount = await prisma.unit.count({
      where: {
        landlord_id: userId
      }
    });

    const tenantsCount = await prisma.landlord_has_tenant.count({
      where: {
        landlord_id: userId
      }
    });

    const totalRevenue = await prisma.tenancy.aggregate({
      _sum: {
        tenancy_amount: true
      },
      where: {
        landlord_id: userId,
        tenancy_end_date: {
          gt: new Date()
        },
        tenancy_start_date: {
          lte: endDate
        },
        tenancy_created_at: {
          gte: startDate
        }
      }
    });

    const totalExpenses = await prisma.expense.aggregate({
      _sum: {
        expense_amount: true
      },
      where: {
        landlord_id: userId,
        expense_date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    let cashflowdp = false;

    for (let month = 0; month < 12; month++) {
      const startDate = startOfMonth(setMonth(new Date(currentYear, 0, 1), month));
      const endDate = endOfMonth(setMonth(new Date(currentYear, 0, 1), month));

      const revenue = await prisma.tenancy.aggregate({
        _sum: {
          tenancy_amount: true
        },
        where: {
          landlord_id: userId,
          tenancy_start_date: {
            lte: endDate
          },
          tenancy_end_date: {
            gte: startDate
          }
        }
      });

      const expenses = await prisma.expense.aggregate({
        _sum: {
          expense_amount: true
        },
        where: {
          landlord_id: userId,
          expense_date: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const cashed = (revenue._sum.tenancy_amount as Decimal)?.toNumber() || 0;
      const spent = (expenses._sum.expense_amount as Decimal)?.toNumber() || 0;

      if (cashed > 0 || spent > 0) {
        cashflowdp = true;
      }

      monthlyReport.push({
        month: monthNames[month],
        cashed,
        spent
      });
    }

    const rentedUnits = await prisma.unit.count({
      where: {
        landlord_id: userId,
        tenancy: {
          some: {
            tenancy_start_date: {
              lte: endDate
            },
            tenancy_end_date: {
              gte: startDate
            }
          }
        }
      }
    });

    const vacantUnits = unitsCount - rentedUnits;
    const occupancydp = rentedUnits > 0 || vacantUnits > 0;

    handleResponse(response, 200, "success", "OK", "Statistiques récupérées avec succès.", { 
      "stats": {
        "units": unitsCount,
        "tenants": tenantsCount,
        "spent": totalExpenses._sum.expense_amount || 0,
        "cashed": totalRevenue._sum.tenancy_amount || 0,
        "cashflow": monthlyReport,
        "cashflowdp": cashflowdp,
        "occupancy": { "rented": rentedUnits, "vacant": vacantUnits },
        "occupancydp": occupancydp
      }
    });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la récupération des statistiques.");
  }
}

export default getStats;