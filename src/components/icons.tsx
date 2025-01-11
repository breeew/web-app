import * as React from 'react';

import { IconSvgProps } from '@/types';

export const Logo: React.FC<IconSvgProps> = ({ size = 22, width = 22, height = 22, ...props }) => {
    return (
        <div className="text-foreground opacity-85">
            <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width={size || width}
                height={size || height}
                fill="currentColor"
                viewBox="0 0 792.000000 717.000000"
                preserveAspectRatio="xMidYMid meet"
                {...props}
            >
                <g transform="translate(0.000000,717.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                    <path
                        d="M2788 7154 c-95 -23 -177 -70 -253 -148 -69 -70 -82 -93 -1278 -2287
-702 -1288 -1217 -2242 -1229 -2280 -31 -93 -29 -231 3 -321 13 -36 235 -473
494 -970 l470 -903 75 -76 c78 -80 135 -115 235 -146 57 -17 119 -18 1110 -18
l1049 0 1428 2615 c785 1438 1435 2629 1444 2645 l16 30 -442 810 c-243 445
-457 831 -476 857 -42 57 -118 119 -187 152 -119 58 -73 56 -1287 55 -914 -1
-1125 -3 -1172 -15z"
                        fill="currentColor"
                    />
                    <path
                        d="M5292 2427 c-722 -1322 -1312 -2409 -1312 -2415 0 -9 137 -12 555
-12 l555 0 24 37 c13 21 481 876 1039 1900 l1016 1862 -280 512 c-153 282
-280 514 -282 516 -2 1 -594 -1079 -1315 -2400z"
                        fill="currentColor"
                    />

                    <path
                        d="M7397 3289 c-68 -118 -1787 -3274 -1787 -3282 0 -4 213 -7 478 -5
428 4 483 6 532 22 125 41 213 101 280 190 47 63 963 1818 992 1901 29 84 34
195 14 288 -14 63 -52 138 -241 485 -123 226 -228 419 -233 428 -8 14 -13 10
-35 -27z"
                        fill="currentColor"
                    />
                </g>
            </svg>
        </div>
    );
};

export const DiscordIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
            <path
                d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
                fill="currentColor"
            />
        </svg>
    );
};

export const TwitterIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
            <path
                d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"
                fill="currentColor"
            />
        </svg>
    );
};

export const GithubIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
            <path
                clipRule="evenodd"
                d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};

export const MoonFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg aria-hidden="true" focusable="false" height={size || height} role="presentation" viewBox="0 0 24 24" width={size || width} {...props}>
        <path
            d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
            fill="currentColor"
        />
    </svg>
);

export const SunFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg aria-hidden="true" focusable="false" height={size || height} role="presentation" viewBox="0 0 24 24" width={size || width} {...props}>
        <g fill="currentColor">
            <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
            <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
        </g>
    </svg>
);

export const HeartFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg aria-hidden="true" focusable="false" height={size || height} width={size || width} role="presentation" viewBox="0 0 24 24" {...props}>
        <path
            d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
            fill="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
        />
    </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
        <path
            d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <path d="M22 22L20 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
);

export const NextUILogo: React.FC<IconSvgProps> = props => {
    const { width, height = 40 } = props;

    return (
        <svg fill="none" height={height} viewBox="0 0 161 32" width={width} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                className="fill-black dark:fill-white"
                d="M55.6827 5V26.6275H53.7794L41.1235 8.51665H40.9563V26.6275H39V5H40.89L53.5911 23.1323H53.7555V5H55.6827ZM67.4831 26.9663C66.1109 27.0019 64.7581 26.6329 63.5903 25.9044C62.4852 25.185 61.6054 24.1633 61.0537 22.9582C60.4354 21.5961 60.1298 20.1106 60.1598 18.6126C60.132 17.1113 60.4375 15.6228 61.0537 14.2563C61.5954 13.0511 62.4525 12.0179 63.5326 11.268C64.6166 10.5379 65.8958 10.16 67.1986 10.1852C68.0611 10.1837 68.9162 10.3468 69.7187 10.666C70.5398 10.9946 71.2829 11.4948 71.8992 12.1337C72.5764 12.8435 73.0985 13.6889 73.4318 14.6152C73.8311 15.7483 74.0226 16.9455 73.9968 18.1479V19.0773H63.2262V17.4194H72.0935C72.1083 16.4456 71.8952 15.4821 71.4714 14.6072C71.083 13.803 70.4874 13.1191 69.7472 12.6272C68.9887 12.1348 68.1022 11.8812 67.2006 11.8987C66.2411 11.8807 65.3005 12.1689 64.5128 12.7223C63.7332 13.2783 63.1083 14.0275 62.6984 14.8978C62.2582 15.8199 62.0314 16.831 62.0352 17.8546V18.8476C62.009 20.0078 62.2354 21.1595 62.6984 22.2217C63.1005 23.1349 63.7564 23.9108 64.5864 24.4554C65.4554 24.9973 66.4621 25.2717 67.4831 25.2448C68.1676 25.2588 68.848 25.1368 69.4859 24.8859C70.0301 24.6666 70.5242 24.3376 70.9382 23.919C71.3183 23.5345 71.6217 23.0799 71.8322 22.5799L73.5995 23.1604C73.3388 23.8697 72.9304 24.5143 72.4019 25.0506C71.8132 25.6529 71.1086 26.1269 70.3314 26.4434C69.4258 26.8068 68.4575 26.9846 67.4831 26.9663V26.9663ZM78.8233 10.4075L82.9655 17.325L87.1076 10.4075H89.2683L84.1008 18.5175L89.2683 26.6275H87.103L82.9608 19.9317L78.8193 26.6275H76.6647L81.7711 18.5169L76.6647 10.4062L78.8233 10.4075ZM99.5142 10.4075V12.0447H91.8413V10.4075H99.5142ZM94.2427 6.52397H96.1148V22.3931C96.086 22.9446 96.2051 23.4938 96.4597 23.9827C96.6652 24.344 96.9805 24.629 97.3589 24.7955C97.7328 24.9548 98.1349 25.0357 98.5407 25.0332C98.7508 25.0359 98.9607 25.02 99.168 24.9857C99.3422 24.954 99.4956 24.9205 99.6283 24.8853L100.026 26.5853C99.8062 26.6672 99.5805 26.7327 99.3511 26.7815C99.0274 26.847 98.6977 26.8771 98.3676 26.8712C97.6854 26.871 97.0119 26.7156 96.3973 26.4166C95.7683 26.1156 95.2317 25.6485 94.8442 25.0647C94.4214 24.4018 94.2097 23.6242 94.2374 22.8363L94.2427 6.52397ZM118.398 5H120.354V19.3204C120.376 20.7052 120.022 22.0697 119.328 23.2649C118.644 24.4235 117.658 25.3698 116.477 26.0001C115.168 26.6879 113.708 27.0311 112.232 26.9978C110.759 27.029 109.302 26.6835 107.996 25.9934C106.815 25.362 105.827 24.4161 105.141 23.2582C104.447 22.0651 104.092 20.7022 104.115 19.319V5H106.08V19.1831C106.061 20.2559 106.324 21.3147 106.843 22.2511C107.349 23.1459 108.094 23.8795 108.992 24.3683C109.993 24.9011 111.111 25.1664 112.242 25.139C113.373 25.1656 114.493 24.9003 115.495 24.3683C116.395 23.8815 117.14 23.1475 117.644 22.2511C118.16 21.3136 118.421 20.2553 118.402 19.1831L118.398 5ZM128 5V26.6275H126.041V5H128Z"
            />
            <path
                className="fill-black dark:fill-white"
                d="M23.5294 0H8.47059C3.79241 0 0 3.79241 0 8.47059V23.5294C0 28.2076 3.79241 32 8.47059 32H23.5294C28.2076 32 32 28.2076 32 23.5294V8.47059C32 3.79241 28.2076 0 23.5294 0Z"
            />
            <path
                className="fill-white dark:fill-black"
                d="M17.5667 9.21729H18.8111V18.2403C18.8255 19.1128 18.6 19.9726 18.159 20.7256C17.7241 21.4555 17.0968 22.0518 16.3458 22.4491C15.5717 22.8683 14.6722 23.0779 13.6473 23.0779C12.627 23.0779 11.7286 22.8672 10.9521 22.4457C10.2007 22.0478 9.5727 21.4518 9.13602 20.7223C8.6948 19.9705 8.4692 19.1118 8.48396 18.2403V9.21729H9.72854V18.1538C9.71656 18.8298 9.88417 19.4968 10.2143 20.0868C10.5362 20.6506 11.0099 21.1129 11.5814 21.421C12.1689 21.7448 12.8576 21.9067 13.6475 21.9067C14.4374 21.9067 15.1272 21.7448 15.7169 21.421C16.2895 21.1142 16.7635 20.6516 17.0844 20.0868C17.4124 19.4961 17.5788 18.8293 17.5667 18.1538V9.21729ZM23.6753 9.21729V22.845H22.4309V9.21729H23.6753Z"
            />
        </svg>
    );
};

export const XiaohongshuLogo: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }: IconSvgProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={height || size} width={width || size} viewBox="0 0 256 256">
            <path
                d="M289.44,256H477.67c17.93,0,33.86,15.57,34.33,33.48V477.72A35.09,35.09,0,0,1,477.66,512H289.5A35.14,35.14,0,0,1,256,477.64V289.56C256.43,271.93,271.81,256.5,289.44,256Zm16.73,91.44c-.13,19.87-.06,39.75-.16,59.63a2.1,2.1,0,0,1-2.13,2.6c-2.39.14-4.79.06-7.19.08,1.61,4,3.35,7.86,5.15,11.73,4.52-.15,9.68.79,13.54-2.17,3.47-2.58,4.58-7.17,4.51-11.3,0-20.19,0-40.39-.09-60.58C315.26,347.41,310.71,347.4,306.17,347.44Zm56.08-.9q-5.08,11.67-10.36,23.24c-1,2.31-2.21,5.37-.11,7.46,2.69,2.44,6.64,1.5,9.94,1.72-2.29,5.78-5.3,11.27-7.23,17.19-1.07,2.92,1.6,5.89,4.52,5.92,5.29.36,10.6,0,15.9.14,1.73-3.87,3.47-7.73,5.17-11.62-3.09,0-6.21.22-9.25-.39,3.29-8.26,7.19-16.25,10.68-24.41-4.27-.5-9.1.89-13-.77,1.9-6.4,5.36-12.27,7.8-18.5C371.61,346.5,366.93,346.47,362.25,346.54Zm72.75.05,0,5.21c-3.06,0-6.12,0-9.18,0q0,7,0,13.93c3.07,0,6.13,0,9.19.06q.12,6,0,12.08c-4.6.09-9.21,0-13.81.07-.06,4.64-.05,9.27,0,13.9,4.61.05,9.23,0,13.84,0,0,9.86,0,19.73,0,29.59,4.62,0,9.23,0,13.85,0q0-14.79,0-29.57c6.74,0,13.47-.1,20.21,0,2.37-.2,5.08,1.46,5,4.07a110.67,110.67,0,0,1,0,11.08,2.26,2.26,0,0,1-2.12,2.39c-3.85.28-7.71,0-11.57.13,1.7,4,3.35,8,5.28,11.95,6.35-.33,14.11,1.27,18.95-4,4.6-4.26,3.22-11,3.41-16.56-.29-5.85,1.14-12.46-2.49-17.58-3.09-4.34-8.66-5.52-13.68-5.61-.3-7,1.37-15.19-3.78-20.88-4.8-5.38-12.53-5.4-19.17-5.14l0-5.2C444.23,346.56,439.61,346.57,435,346.59Zm-49.42,5.22q0,7,0,13.92c2.9,0,5.79,0,8.69,0,0,13.91,0,27.83,0,41.74-4.15.07-8.31,0-12.46.05-2.15,4.62-4.25,9.26-6.34,13.9,15.48.06,31,0,46.44,0q0-6.94,0-13.9c-4.45,0-8.91,0-13.36-.05q0-20.88,0-41.77c2.91,0,5.81,0,8.72,0,0-4.64,0-9.29,0-13.93C406.73,351.79,396.16,351.77,385.58,351.81Zm91.35,1.28c-3.88,2.94-2.61,8.32-2.78,12.51,2.59,0,5.19.14,7.78-.09,4.16-.38,7.29-5.23,5.62-9.15C486.24,352.06,480.43,350.19,476.93,353.09ZM283,365.72c-.7,9.12-1.41,18.23-2.07,27.35a22.12,22.12,0,0,1-1.32,6.06c2.34,5.35,4.68,10.7,7.18,16,5.6-7.49,7.68-16.93,8.26-26.1.49-7.8,1.36-15.59,1.64-23.4C292.1,365.79,287.54,365.68,283,365.72Zm46.13,0q1,12.69,2,25.37c.73,8.48,2.92,17.12,8.1,24,2.47-5.29,4.83-10.63,7.17-16A21.67,21.67,0,0,1,345,393c-.66-9.09-1.38-18.18-2.08-27.27Q336,365.69,329.1,365.72Zm17.16,54.69c7.08,2.09,14.58.66,21.85,1.05,2.14-4.63,4.27-9.27,6.35-13.93-7.27-.28-14.67.76-21.8-1.07Q349.42,413.41,346.26,420.41Z"
                transform="translate(-256 -256)"
                fill="#ff2741"
            />
            <path d="M448.77,365.77c3,.43,7-1.22,9.29,1.2.38,3.65.1,7.32.14,11-3.11,0-6.23,0-9.34,0Q448.77,371.87,448.77,365.77Z" transform="translate(-256 -256)" fill="#ff2741" />
            <path
                d="M306.17,347.44c4.54,0,9.09,0,13.63,0,.13,20.19.08,40.39.09,60.58.07,4.13-1,8.72-4.51,11.3-3.86,3-9,2-13.54,2.17-1.8-3.87-3.54-7.77-5.15-11.73,2.4,0,4.8.06,7.19-.08a2.1,2.1,0,0,0,2.13-2.6C306.11,387.19,306,367.31,306.17,347.44Z"
                transform="translate(-256 -256)"
                fill="#fff"
            />
            <path
                d="M362.25,346.54c4.68-.07,9.36,0,14,0-2.44,6.23-5.9,12.1-7.8,18.5,3.92,1.66,8.75.27,13,.77-3.49,8.16-7.39,16.15-10.68,24.41,3,.61,6.16.39,9.25.39-1.7,3.89-3.44,7.75-5.17,11.62-5.3-.09-10.61.22-15.9-.14-2.92,0-5.59-3-4.52-5.92,1.93-5.92,4.94-11.41,7.23-17.19-3.3-.22-7.25.72-9.94-1.72-2.1-2.09-.88-5.15.11-7.46Q357.14,358.2,362.25,346.54Z"
                transform="translate(-256 -256)"
                fill="#fff"
            />
            <path
                d="M435,346.59c4.61,0,9.23,0,13.84,0l0,5.2c6.64-.26,14.37-.24,19.17,5.14,5.15,5.69,3.48,13.9,3.78,20.88,5,.09,10.59,1.27,13.68,5.61,3.63,5.12,2.2,11.73,2.49,17.58-.19,5.57,1.19,12.3-3.41,16.56-4.84,5.23-12.6,3.63-18.95,4-1.93-3.91-3.58-7.94-5.28-11.95,3.86-.11,7.72.15,11.57-.13a2.26,2.26,0,0,0,2.12-2.39,110.67,110.67,0,0,0,0-11.08c.07-2.61-2.64-4.27-5-4.07-6.74-.1-13.47,0-20.21,0q0,14.79,0,29.57c-4.62,0-9.23,0-13.85,0,0-9.86,0-19.73,0-29.59-4.61,0-9.23,0-13.84,0,0-4.63,0-9.26,0-13.9,4.6,0,9.21,0,13.81-.07q.13-6,0-12.08c-3.06-.05-6.12-.09-9.19-.06q0-7,0-13.93c3.06,0,6.12,0,9.18,0Zm13.77,19.18q0,6.1.09,12.2c3.11,0,6.23,0,9.34,0,0-3.66.24-7.33-.14-11C455.77,364.55,451.77,366.2,448.77,365.77Z"
                transform="translate(-256 -256)"
                fill="#fff"
            />
            <path
                d="M385.58,351.81c10.58,0,21.15,0,31.72,0,0,4.64,0,9.29,0,13.93-2.91,0-5.81,0-8.72,0q0,20.89,0,41.77c4.45.05,8.91,0,13.36.05q0,6.94,0,13.9c-15.48,0-31,0-46.44,0,2.09-4.64,4.19-9.28,6.34-13.9,4.15,0,8.31,0,12.46-.05,0-13.91,0-27.83,0-41.74-2.9,0-5.79,0-8.69,0Q385.55,358.77,385.58,351.81Z"
                transform="translate(-256 -256)"
                fill="#fff"
            />
            <path
                d="M476.93,353.09c3.5-2.9,9.31-1,10.62,3.27,1.67,3.92-1.46,8.77-5.62,9.15-2.59.23-5.19.1-7.78.09C474.32,361.41,473.05,356,476.93,353.09Z"
                transform="translate(-256 -256)"
                fill="#fff"
            />
            <path
                d="M283,365.72c4.57,0,9.13.07,13.69-.11-.28,7.81-1.15,15.6-1.64,23.4-.58,9.17-2.66,18.61-8.26,26.1-2.5-5.28-4.84-10.63-7.18-16a22.12,22.12,0,0,0,1.32-6.06C281.56,384,282.27,374.84,283,365.72Z"
                transform="translate(-256 -256)"
                fill="#fff"
            />
            <path
                d="M329.1,365.72q6.91,0,13.83,0c.7,9.09,1.42,18.18,2.08,27.27a21.67,21.67,0,0,0,1.32,6.15c-2.34,5.35-4.7,10.69-7.17,16-5.18-6.91-7.37-15.55-8.1-24S329.77,374.18,329.1,365.72Z"
                transform="translate(-256 -256)"
                fill="#fff"
            />
            <path
                d="M346.26,420.41q3.17-7,6.4-13.95c7.13,1.83,14.53.79,21.8,1.07-2.08,4.66-4.21,9.3-6.35,13.93C360.84,421.07,353.34,422.5,346.26,420.41Z"
                transform="translate(-256 -256)"
                fill="#fff"
            />
        </svg>
    );
};

export const ObsidianLogo: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }: IconSvgProps) => {
    return (
        <svg height={height || size} width={width || size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="b" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-48 -185 123 -32 179 429.7)">
                    <stop stop-color="#fff" stop-opacity=".4" />
                    <stop offset="1" stop-opacity=".1" />
                </radialGradient>
                <radialGradient id="c" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(41 -310 229 30 341.6 351.3)">
                    <stop stop-color="#fff" stop-opacity=".6" />
                    <stop offset="1" stop-color="#fff" stop-opacity=".1" />
                </radialGradient>
                <radialGradient id="d" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(57 -261 178 39 190.5 296.3)">
                    <stop stop-color="#fff" stop-opacity=".8" />
                    <stop offset="1" stop-color="#fff" stop-opacity=".4" />
                </radialGradient>
                <radialGradient id="e" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-79 -133 153 -90 321.4 464.2)">
                    <stop stop-color="#fff" stop-opacity=".3" />
                    <stop offset="1" stop-opacity=".3" />
                </radialGradient>
                <radialGradient id="f" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-29 136 -92 -20 300.7 149.9)">
                    <stop stop-color="#fff" stop-opacity="0" />
                    <stop offset="1" stop-color="#fff" stop-opacity=".2" />
                </radialGradient>
                <radialGradient id="g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(72 73 -155 153 137.8 225.2)">
                    <stop stop-color="#fff" stop-opacity=".2" />
                    <stop offset="1" stop-color="#fff" stop-opacity=".4" />
                </radialGradient>
                <radialGradient id="h" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(20 118 -251 43 215.1 273.7)">
                    <stop stop-color="#fff" stop-opacity=".1" />
                    <stop offset="1" stop-color="#fff" stop-opacity=".3" />
                </radialGradient>
                <radialGradient id="i" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-162 -85 268 -510 374.4 371.7)">
                    <stop stop-color="#fff" stop-opacity=".2" />
                    <stop offset=".5" stop-color="#fff" stop-opacity=".2" />
                    <stop offset="1" stop-color="#fff" stop-opacity=".3" />
                </radialGradient>
                <filter id="a" x="80.1" y="37" width="351.1" height="443.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="6.5" result="effect1_foregroundBlur_744_9191" />
                </filter>
            </defs>
            <rect id="logo-bg" fill="#262626" width="512" height="512" rx="100" />
            <g filter="url(#a)">
                <path
                    d="M359.2 437.5c-2.6 19-21.3 33.9-40 28.7-26.5-7.2-57.2-18.6-84.8-20.7l-42.4-3.2a28 28 0 0 1-18-8.3l-73-74.8a27.7 27.7 0 0 1-5.4-30.7s45-98.6 46.8-103.7c1.6-5.1 7.8-49.9 11.4-73.9a28 28 0 0 1 9-16.5L249 57.2a28 28 0 0 1 40.6 3.4l72.6 91.6a29.5 29.5 0 0 1 6.2 18.3c0 17.3 1.5 53 11.2 76a301.3 301.3 0 0 0 35.6 58.2 14 14 0 0 1 1 15.6c-6.3 10.7-18.9 31.3-36.6 57.6a142.2 142.2 0 0 0-20.5 59.6Z"
                    fill="#000"
                    fill-opacity=".3"
                />
            </g>
            <path
                id="arrow"
                d="M359.9 434.3c-2.6 19.1-21.3 34-40 28.9-26.4-7.3-57-18.7-84.7-20.8l-42.3-3.2a27.9 27.9 0 0 1-18-8.4l-73-75a27.9 27.9 0 0 1-5.4-31s45.1-99 46.8-104.2c1.7-5.1 7.8-50 11.4-74.2a28 28 0 0 1 9-16.6l86.2-77.5a28 28 0 0 1 40.6 3.5l72.5 92a29.7 29.7 0 0 1 6.2 18.3c0 17.4 1.5 53.2 11.1 76.3a303 303 0 0 0 35.6 58.5 14 14 0 0 1 1.1 15.7c-6.4 10.8-18.9 31.4-36.7 57.9a143.3 143.3 0 0 0-20.4 59.8Z"
                fill="#6C31E3"
            />
            <path d="M182.7 436.4c33.9-68.7 33-118 18.5-153-13.2-32.4-37.9-52.8-57.3-65.5-.4 1.9-1 3.7-1.8 5.4L96.5 324.8a27.9 27.9 0 0 0 5.5 31l72.9 75c2.3 2.3 5 4.2 7.8 5.6Z" fill="url(#b)" />
            <path
                d="M274.9 297c9.1.9 18 2.9 26.8 6.1 27.8 10.4 53.1 33.8 74 78.9 1.5-2.6 3-5.1 4.6-7.5a1222 1222 0 0 0 36.7-57.9 14 14 0 0 0-1-15.7 303 303 0 0 1-35.7-58.5c-9.6-23-11-58.9-11.1-76.3 0-6.6-2.1-13.1-6.2-18.3l-72.5-92-1.2-1.5c5.3 17.5 5 31.5 1.7 44.2-3 11.8-8.6 22.5-14.5 33.8-2 3.8-4 7.7-5.9 11.7a140 140 0 0 0-15.8 58c-1 24.2 3.9 54.5 20 95Z"
                fill="url(#c)"
            />
            <path
                d="M274.8 297c-16.1-40.5-21-70.8-20-95 1-24 8-42 15.8-58l6-11.7c5.8-11.3 11.3-22 14.4-33.8a78.5 78.5 0 0 0-1.7-44.2 28 28 0 0 0-39.4-2l-86.2 77.5a28 28 0 0 0-9 16.6L144.2 216c0 .7-.2 1.3-.3 2 19.4 12.6 44 33 57.3 65.3 2.6 6.4 4.8 13.1 6.4 20.4a200 200 0 0 1 67.2-6.8Z"
                fill="url(#d)"
            />
            <path
                d="M320 463.2c18.6 5.1 37.3-9.8 39.9-29a153 153 0 0 1 15.9-52.2c-21-45.1-46.3-68.5-74-78.9-29.5-11-61.6-7.3-94.2.6 7.3 33.1 3 76.4-24.8 132.7 3.1 1.6 6.6 2.5 10.1 2.8l43.9 3.3c23.8 1.7 59.3 14 83.2 20.7Z"
                fill="url(#e)"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M255 200.5c-1.1 24 1.9 51.4 18 91.8l-5-.5c-14.5-42.1-17.7-63.7-16.6-88 1-24.3 8.9-43 16.7-59 2-4 6.6-11.5 8.6-15.3 5.8-11.3 9.7-17.2 13-27.5 4.8-14.4 3.8-21.2 3.2-28 3.7 24.5-10.4 45.8-21 67.5a145 145 0 0 0-17 59Z"
                fill="url(#f)"
            />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M206 285.1c2 4.4 3.7 8 4.9 13.5l-4.3 1c-1.7-6.4-3-11-5.5-16.5-14.6-34.3-38-52-57-65 23 12.4 46.7 31.9 61.9 67Z" fill="url(#g)" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M211.1 303c8 37.5-1 85.2-27.5 131.6 22.2-46 33-90.1 24-131l3.5-.7Z" fill="url(#h)" />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M302.7 299.5c43.5 16.3 60.3 52 72.8 81.9-15.5-31.2-37-65.7-74.4-78.5-28.4-9.8-52.4-8.6-93.5.7l-.9-4c43.6-10 66.4-11.2 96 0Z"
                fill="url(#i)"
            />
        </svg>
    );
};
