import Link from "next/link";

import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="container px-6">
      <header className="flex flex-row justify-between items-center h-16">
        <div className="flex flex-row items-center gap-x-6">
          <svg width="155" height="28" viewBox="0 0 155 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M151.074 13.3286L148.618 7.60923H149.729L151.384 11.6656L153.032 7.60923H154.143L151.695 13.3286H151.074ZM148.346 13.3286V7.60923H149.488V13.3286H148.346ZM153.273 13.3286V7.60923H154.415V13.3286H153.273ZM144.468 13.3286V8.10657H145.611V13.3286H144.468ZM142.728 8.58836V7.60923H147.351V8.58836H142.728Z" fill="#18181C"/>
            <path d="M137.323 23.7649C136.204 23.7649 135.227 23.5084 134.393 22.9956C133.559 22.4827 132.911 21.7652 132.45 20.843C131.989 19.9209 131.759 18.8433 131.759 17.6103C131.759 16.3722 131.989 15.2894 132.45 14.3621C132.911 13.4348 133.559 12.7147 134.393 12.2018C135.227 11.6889 136.204 11.4325 137.323 11.4325C138.442 11.4325 139.418 11.6889 140.252 12.2018C141.086 12.7147 141.734 13.4348 142.195 14.3621C142.656 15.2894 142.887 16.3722 142.887 17.6103C142.887 18.8433 142.656 19.9209 142.195 20.843C141.734 21.7652 141.086 22.4827 140.252 22.9956C139.418 23.5084 138.442 23.7649 137.323 23.7649ZM137.33 21.8144C138.056 21.8144 138.657 21.6227 139.133 21.2393C139.61 20.856 139.962 20.3457 140.19 19.7085C140.423 19.0713 140.54 18.3693 140.54 17.6026C140.54 16.841 140.423 16.1416 140.19 15.5044C139.962 14.862 139.61 14.3466 139.133 13.958C138.657 13.5695 138.056 13.3752 137.33 13.3752C136.6 13.3752 135.994 13.5695 135.512 13.958C135.036 14.3466 134.681 14.862 134.448 15.5044C134.22 16.1416 134.106 16.841 134.106 17.6026C134.106 18.3693 134.22 19.0713 134.448 19.7085C134.681 20.3457 135.036 20.856 135.512 21.2393C135.994 21.6227 136.6 21.8144 137.33 21.8144Z" fill="#18181C"/>
            <path d="M128.159 23.524V11.5879H130.482V23.524H128.159ZM129.332 9.74622C128.928 9.74622 128.581 9.61152 128.291 9.34213C128.006 9.06756 127.863 8.74119 127.863 8.363C127.863 7.97964 128.006 7.65327 128.291 7.38387C128.581 7.1093 128.928 6.97202 129.332 6.97202C129.736 6.97202 130.081 7.1093 130.366 7.38387C130.656 7.65327 130.801 7.97964 130.801 8.363C130.801 8.74119 130.656 9.06756 130.366 9.34213C130.081 9.61152 129.736 9.74622 129.332 9.74622Z" fill="#18181C"/>
            <path d="M121.073 23.524V11.5879H123.319V13.484H123.443C123.661 12.8416 124.044 12.3365 124.593 11.9687C125.148 11.5957 125.775 11.4092 126.474 11.4092C126.619 11.4092 126.79 11.4144 126.987 11.4247C127.189 11.4351 127.347 11.448 127.461 11.4636V13.6861C127.368 13.6602 127.202 13.6317 126.964 13.6006C126.725 13.5643 126.487 13.5462 126.249 13.5462C125.699 13.5462 125.21 13.6627 124.78 13.8959C124.355 14.1238 124.018 14.4424 123.77 14.8517C123.521 15.2558 123.397 15.7168 123.397 16.2349V23.524H121.073Z" fill="#18181C"/>
            <path d="M113.401 23.7882C112.645 23.7882 111.961 23.6483 111.35 23.3686C110.738 23.0836 110.254 22.6718 109.896 22.133C109.544 21.5942 109.368 20.9337 109.368 20.1514C109.368 19.4779 109.498 18.9236 109.757 18.4884C110.016 18.0533 110.365 17.7088 110.806 17.4549C111.246 17.2011 111.738 17.0094 112.282 16.8799C112.826 16.7504 113.38 16.6519 113.945 16.5846C114.66 16.5017 115.24 16.4343 115.686 16.3825C116.131 16.3256 116.455 16.2349 116.657 16.1106C116.859 15.9862 116.96 15.7842 116.96 15.5044V15.45C116.96 14.7714 116.768 14.2456 116.385 13.8726C116.007 13.4995 115.442 13.313 114.691 13.313C113.909 13.313 113.292 13.4866 112.842 13.8337C112.396 14.1756 112.088 14.5564 111.917 14.976L109.733 14.4787C109.992 13.7534 110.37 13.168 110.868 12.7225C111.37 12.2718 111.948 11.9454 112.601 11.7433C113.253 11.5361 113.94 11.4325 114.66 11.4325C115.137 11.4325 115.642 11.4895 116.175 11.6035C116.714 11.7123 117.217 11.9143 117.683 12.2096C118.154 12.5049 118.54 12.9271 118.841 13.4762C119.141 14.0202 119.291 14.7273 119.291 15.5977V23.524H117.022V21.8921H116.929C116.779 22.1926 116.553 22.4879 116.253 22.778C115.953 23.0681 115.567 23.309 115.095 23.5007C114.624 23.6923 114.059 23.7882 113.401 23.7882ZM113.906 21.9232C114.549 21.9232 115.098 21.7962 115.554 21.5424C116.015 21.2886 116.364 20.957 116.603 20.5477C116.846 20.1333 116.968 19.6903 116.968 19.2189V17.6803C116.885 17.7632 116.724 17.8409 116.486 17.9134C116.253 17.9808 115.986 18.0403 115.686 18.0921C115.385 18.1388 115.093 18.1828 114.808 18.2242C114.523 18.2605 114.284 18.2916 114.093 18.3175C113.642 18.3745 113.23 18.4703 112.857 18.605C112.489 18.7397 112.194 18.934 111.971 19.1878C111.754 19.4365 111.645 19.7681 111.645 20.1825C111.645 20.7575 111.857 21.1927 112.282 21.488C112.707 21.7781 113.248 21.9232 113.906 21.9232Z" fill="#18181C"/>
            <path d="M108.67 11.5879V13.4529H102.151V11.5879H108.67ZM103.899 8.72824H106.222V20.0193C106.222 20.47 106.29 20.8093 106.425 21.0373C106.559 21.2601 106.733 21.4129 106.945 21.4958C107.163 21.5735 107.398 21.6123 107.652 21.6123C107.839 21.6123 108.002 21.5994 108.142 21.5735C108.282 21.5476 108.391 21.5269 108.468 21.5113L108.888 23.4307C108.753 23.4825 108.561 23.5343 108.313 23.5861C108.064 23.6431 107.753 23.6742 107.38 23.6794C106.769 23.6898 106.199 23.581 105.671 23.353C105.142 23.1251 104.715 22.7728 104.389 22.2962C104.062 21.8196 103.899 21.2212 103.899 20.5011V8.72824Z" fill="#18181C"/>
            <path d="M96.7125 23.7649C95.5365 23.7649 94.5237 23.5136 93.6741 23.0111C92.8297 22.5034 92.1769 21.7911 91.7159 20.8741C91.26 19.952 91.032 18.8718 91.032 17.6337C91.032 16.411 91.26 15.3335 91.7159 14.401C92.1769 13.4685 92.8193 12.7406 93.643 12.2174C94.4719 11.6941 95.4407 11.4325 96.5493 11.4325C97.2228 11.4325 97.8756 11.5439 98.5076 11.7666C99.1396 11.9894 99.7069 12.3391 100.209 12.8157C100.712 13.2923 101.108 13.9114 101.398 14.673C101.688 15.4293 101.834 16.3489 101.834 17.4316V18.2553H92.3453V16.5146H99.5567C99.5567 15.9033 99.4323 15.362 99.1837 14.8905C98.935 14.4139 98.5853 14.0383 98.1346 13.7638C97.6891 13.4892 97.1658 13.3519 96.5649 13.3519C95.9121 13.3519 95.3423 13.5125 94.8553 13.8337C94.3735 14.1497 94.0005 14.5642 93.7363 15.077C93.4773 15.5847 93.3477 16.1365 93.3477 16.7322V18.0921C93.3477 18.8899 93.4876 19.5686 93.7674 20.1281C94.0523 20.6876 94.4486 21.115 94.9563 21.4103C95.464 21.7004 96.0572 21.8455 96.7358 21.8455C97.1762 21.8455 97.5777 21.7833 97.9403 21.659C98.303 21.5294 98.6164 21.3378 98.8806 21.0839C99.1448 20.8301 99.3469 20.5166 99.4867 20.1436L101.686 20.54C101.51 21.1875 101.194 21.7548 100.738 22.2418C100.287 22.7236 99.7199 23.0992 99.036 23.3686C98.3574 23.6328 97.5829 23.7649 96.7125 23.7649Z" fill="#18181C"/>
            <path d="M87.4319 23.524V11.5879H89.7554V23.524H87.4319ZM88.6053 9.74622C88.2012 9.74622 87.8541 9.61152 87.564 9.34213C87.279 9.06756 87.1366 8.74119 87.1366 8.363C87.1366 7.97964 87.279 7.65327 87.564 7.38387C87.8541 7.1093 88.2012 6.97202 88.6053 6.97202C89.0094 6.97202 89.3539 7.1093 89.6388 7.38387C89.9289 7.65327 90.074 7.97964 90.074 8.363C90.074 8.74119 89.9289 9.06756 89.6388 9.34213C89.3539 9.61152 89.0094 9.74622 88.6053 9.74622Z" fill="#18181C"/>
            <path d="M80.3465 23.524V11.5879H82.5923V13.484H82.7166C82.9342 12.8416 83.3175 12.3365 83.8667 11.9687C84.421 11.5957 85.0479 11.4092 85.7472 11.4092C85.8923 11.4092 86.0633 11.4144 86.2601 11.4247C86.4622 11.4351 86.6202 11.448 86.7341 11.4636V13.6861C86.6409 13.6602 86.4751 13.6317 86.2368 13.6006C85.9985 13.5643 85.7602 13.5462 85.5219 13.5462C84.9727 13.5462 84.4832 13.6627 84.0532 13.8959C83.6284 14.1238 83.2916 14.4424 83.043 14.8517C82.7943 15.2558 82.67 15.7168 82.67 16.2349V23.524H80.3465Z" fill="#18181C"/>
            <path d="M68.1537 28V11.5879H70.4228V13.5229H70.617C70.7517 13.2742 70.946 12.9867 71.1998 12.6603C71.4537 12.3339 71.806 12.049 72.2567 11.8055C72.7074 11.5568 73.3032 11.4325 74.044 11.4325C75.0076 11.4325 75.8675 11.676 76.6239 12.163C77.3803 12.6499 77.9734 13.3519 78.4034 14.2689C78.8386 15.1858 79.0562 16.2893 79.0562 17.5793C79.0562 18.8692 78.8412 19.9753 78.4112 20.8974C77.9812 21.8144 77.3906 22.5215 76.6394 23.0189C75.8883 23.511 75.0309 23.7571 74.0673 23.7571C73.342 23.7571 72.7488 23.6354 72.2878 23.3919C71.8319 23.1484 71.4744 22.8634 71.2154 22.5371C70.9564 22.2107 70.7569 21.9206 70.617 21.6667H70.4771V28H68.1537ZM70.4305 17.5559C70.4305 18.3952 70.5523 19.1308 70.7958 19.7629C71.0392 20.3949 71.3915 20.8896 71.8526 21.2471C72.3137 21.5994 72.8783 21.7755 73.5466 21.7755C74.2408 21.7755 74.8211 21.5916 75.2873 21.2238C75.7536 20.8508 76.1058 20.3457 76.3442 19.7085C76.5876 19.0713 76.7094 18.3538 76.7094 17.5559C76.7094 16.7685 76.5902 16.0613 76.3519 15.4345C76.1188 14.8076 75.7665 14.3129 75.2951 13.9503C74.8288 13.5876 74.246 13.4063 73.5466 13.4063C72.8732 13.4063 72.3033 13.5798 71.837 13.9269C71.376 14.274 71.0263 14.7584 70.788 15.3801C70.5497 16.0018 70.4305 16.7271 70.4305 17.5559Z" fill="#18181C"/>
            <path d="M61.3092 23.7649C60.1902 23.7649 59.2136 23.5084 58.3795 22.9956C57.5455 22.4827 56.8979 21.7652 56.4368 20.843C55.9758 19.9209 55.7452 18.8433 55.7452 17.6103C55.7452 16.3722 55.9758 15.2894 56.4368 14.3621C56.8979 13.4348 57.5455 12.7147 58.3795 12.2018C59.2136 11.6889 60.1902 11.4325 61.3092 11.4325C62.4282 11.4325 63.4047 11.6889 64.2388 12.2018C65.0729 12.7147 65.7204 13.4348 66.1815 14.3621C66.6426 15.2894 66.8731 16.3722 66.8731 17.6103C66.8731 18.8433 66.6426 19.9209 66.1815 20.843C65.7204 21.7652 65.0729 22.4827 64.2388 22.9956C63.4047 23.5084 62.4282 23.7649 61.3092 23.7649ZM61.3169 21.8144C62.0422 21.8144 62.6432 21.6227 63.1198 21.2393C63.5964 20.856 63.9487 20.3457 64.1766 19.7085C64.4097 19.0713 64.5263 18.3693 64.5263 17.6026C64.5263 16.841 64.4097 16.1416 64.1766 15.5044C63.9487 14.862 63.5964 14.3466 63.1198 13.958C62.6432 13.5695 62.0422 13.3752 61.3169 13.3752C60.5865 13.3752 59.9803 13.5695 59.4986 13.958C59.0219 14.3466 58.6671 14.862 58.4339 15.5044C58.206 16.1416 58.092 16.841 58.092 17.6026C58.092 18.3693 58.206 19.0713 58.4339 19.7085C58.6671 20.3457 59.0219 20.856 59.4986 21.2393C59.9803 21.6227 60.5865 21.8144 61.3169 21.8144Z" fill="#18181C"/>
            <path d="M49.6234 23.524V11.5879H51.8692V13.484H51.9935C52.2111 12.8416 52.5945 12.3365 53.1436 11.9687C53.6979 11.5957 54.3248 11.4092 55.0242 11.4092C55.1692 11.4092 55.3402 11.4144 55.537 11.4247C55.7391 11.4351 55.8971 11.448 56.0111 11.4636V13.6861C55.9178 13.6602 55.752 13.6317 55.5137 13.6006C55.2754 13.5643 55.0371 13.5462 54.7988 13.5462C54.2497 13.5462 53.7601 13.6627 53.3301 13.8959C52.9053 14.1238 52.5686 14.4424 52.3199 14.8517C52.0712 15.2558 51.9469 15.7168 51.9469 16.2349V23.524H49.6234Z" fill="#18181C"/>
            <path d="M37.1256 23.524V7.60923H42.7983C44.0365 7.60923 45.0622 7.83459 45.8756 8.2853C46.6889 8.73601 47.2977 9.3525 47.7017 10.1348C48.1058 10.9119 48.3079 11.7874 48.3079 12.7613C48.3079 13.7405 48.1032 14.6211 47.694 15.4034C47.2899 16.1805 46.6786 16.797 45.8601 17.2529C45.0467 17.7036 44.0235 17.9289 42.7906 17.9289H38.8896V15.893H42.573C43.3552 15.893 43.9899 15.7583 44.4768 15.4889C44.9638 15.2143 45.3213 14.8413 45.5492 14.3699C45.7772 13.8985 45.8911 13.3623 45.8911 12.7613C45.8911 12.1604 45.7772 11.6268 45.5492 11.1605C45.3213 10.6943 44.9612 10.329 44.4691 10.0648C43.9821 9.80062 43.3397 9.66851 42.5419 9.66851H39.5268V23.524H37.1256Z" fill="#18181C"/>
            <path d="M31.1829 7.91261L15.5915 0L0 7.91261V23.524H31.1829V7.91261Z" fill="#18181C"/>
          </svg>
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">Accueil</Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">Tarifs</Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">Témoignages</Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</Link>
          </nav>
        </div>
        <div className="flex flex-row items-center gap-x-3">
          <Link href="/login" className="text-muted-foreground transition-colors hover:text-foreground text-sm">Se connecter</Link>
          <Link href="/register">
            <Button size="sm">S'enregistrer</Button>
          </Link>
        </div>
      </header>
    </div>
  );
}