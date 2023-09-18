import Dropdown from '@/components/Dropdown';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import { getDashboardStats } from '@/apicalls/dashboard';
import { useSession } from 'next-auth/react';
import { formatDate, getYear } from '@/utility_methods/datey';
import { useMemo } from 'react';

const ReactApexChart = dynamic(import('react-apexcharts'), { ssr: false });

// studentsCountOptions
const studentsCount: any = {
    series: [
        {
            name: 'Primary',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
            name: 'Secondary',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
    ],
    options: {
        chart: {
            height: 300,
            type: 'bar',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        title: {
            text: 'Students By Class',
            align: 'left',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: undefined,
                color: '#263238',
            },
        },
        colors: ['#805dca', '#e7515a'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        grid: {
            // borderColor: isDark ? '#191e3a' : '#e0e6ed',
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            axisBorder: {
                // color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            // opposite: isRtl ? true : false,
            labels: {
                // offsetX: isRtl ? -10 : 0,
            },
        },
        tooltip: {
            // theme: isDark ? 'dark' : 'light',
            y: {
                formatter: function (val: any) {
                    return val;
                },
            },
        },
    },
};

const admissionChart: any = {
    series: [
        {
            name: 'TOTAL',
            data: [44, 55, 41, 67, 22, 43],
        },
        {
            name: 'PENDING',
            data: [13, 23, 20, 8, 13, 27],
        },
    ],
    options: {
        chart: {
            height: 300,
            type: 'bar',
            stacked: true,
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#2196f3', '#3b3f5c'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 5,
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            type: 'datetime',
            categories: ['01/01/2023 GMT', '01/02/2023 GMT', '01/03/2023 GMT', '01/04/2023 GMT', '01/05/2023 GMT', '01/06/2023 GMT'],
            axisBorder: {
                // color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            // opposite: isRtl ? true : false,
            labels: {
                // offsetX: isRtl ? -20 : 0,
            },
        },
        grid: {
            // borderColor: isDark ? '#191e3a' : '#e0e6ed',
        },
        legend: {
            position: 'right',
            offsetY: 40,
        },
        tooltip: {
            // theme: isDark ? 'dark' : 'light',
        },
        fill: {
            opacity: 0.8,
        },
        title: {
            text: 'Admission Breakdown',
            align: 'left',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: undefined,
                color: '#263238',
            },
        },
    },
};

// teachersChartOptions

const Dashboard = (props: any) => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const { data: user_session } = useSession();

    const { data, refetch } = useQuery('dashboard-stats', () => getDashboardStats(user_session?.school?.id, user_session?.access_token));

    const addmissionChart: any = useMemo(
        () => ({
            series: [data?.total_approved_student, data?.total_pending_student, data?.total_denied_student],
            options: {
                chart: {
                    height: 300,
                    type: 'pie',
                    zoom: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false,
                    },
                },
                labels: ['Admitted', 'Pending', 'Denied'],
                colors: ['#00BCD4', '#805dca', '#F44336'],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                            },
                        },
                    },
                ],
                stroke: {
                    show: false,
                },
                legend: {
                    position: 'bottom',
                },
                title: {
                    text: 'Addmissions Stats',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        fontFamily: undefined,
                        color: '#263238',
                    },
                },
            },
        }),
        [data]
    );

    const teachersChart: any = useMemo(
        () => ({
            series: [data?.male_staff_count, data?.female_staff_count],
            options: {
                chart: {
                    height: 300,
                    type: 'pie',
                    zoom: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false,
                    },
                },
                labels: ['Male', 'Female'],
                colors: ['#e2a03f', '#805dca'],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                            },
                        },
                    },
                ],
                stroke: {
                    show: false,
                },
                legend: {
                    position: 'bottom',
                },
                title: {
                    text: 'Teachers Count',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        fontFamily: undefined,
                        color: '#263238',
                    },
                },
            },
        }),
        [data]
    );

    const studentsChart: any = useMemo(
        () => ({
            series: [data?.paid_percentage, data?.outstanding_percentage],
            options: {
                chart: {
                    height: 300,
                    type: 'radialBar',
                    zoom: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false,
                    },
                },
                colors: ['#4361ee', '#e2a03f'],
                grid: {
                    // borderColor: isDark ? '#191e3a' : '#e0e6ed',
                },
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            name: {
                                fontSize: '22px',
                            },
                            value: {
                                fontSize: '16px',
                            },
                            total: {
                                show: true,
                                label: 'Total',
                            },
                        },
                    },
                },
                labels: ['Paid', 'Outstanding'],
                fill: {
                    opacity: 0.85,
                },
                title: {
                    text: 'Students Count',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        fontFamily: undefined,
                        color: '#263238',
                    },
                },
            },
        }),
        [data]
    );

    // {
    //     "total_student": 8,
    //     "male_student_count": 4,
    //     "female_student_count": 4,
    //     "total_approved_student": 7,
    //     "total_pending_student": 0,
    //     "total_denied_student": 1,
    //     "male_staff_count": 1,
    //     "female_staff_count": 1,
    //     "total_staff": 2,
    //     "total_paid": 0,
    //     "total_outstanding": 0,
    //     "total_amount": 0,
    //     "paid_percentage": 0,
    //     "outstanding_percentage": 0,
    //     "session": "2023-09-07/2023-12-30",
    //     "session_start_date": "2023-09-07",
    //     "session_end_date": "2023-12-30",
    //     "session_resumption_date": "2023-09-22"
    // }

    return (
        <div className="pb-10">
            {/* OVERVIEW TABS */}
            <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                {/* SESSION */}
                <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Session</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {data?.session} </div>
                        <div className="badge bg-white/30">+ 0.35% </div>
                    </div>
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Second Term
                    </div>
                </div>
                {/* TOTAL STAFFS */}
                <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Staffs</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{data?.total_staff} </div>
                        <div className="badge bg-white/30">+ 2.35% </div>
                    </div>
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Resumption Date {formatDate(data?.session_resumption_date)}
                    </div>
                </div>
                {/* TOTAL STUDENTS */}
                <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Students</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{data?.total_student} </div>
                        <div className="badge bg-white/30">+ 2.35% </div>
                    </div>
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Session Starts {formatDate(data?.session_start_date)}
                    </div>
                </div>
                {/*  ADMISSION */}
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Admissions</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {data?.total_approved_student} </div>
                        <div className="badge bg-white/30">+ 1.35% </div>
                    </div>
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Session Ends {formatDate(data?.session_end_date)}
                    </div>
                </div>
            </div>
            {/* END OF OVERVIEW TABS */}

            {/* STUDENTS HISTOGRAM CHART */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    {/* <h1 className='text-xl py-2'>Students Count</h1> */}
                    <ReactApexChart
                        series={studentsCount.series}
                        options={studentsCount.options}
                        className="h-auto overflow-hidden rounded-lg bg-white p-4 shadow-sm dark:bg-black"
                        type="bar"
                        height={300}
                    />
                </div>
                <div>
                    <ReactApexChart
                        series={addmissionChart.series}
                        options={addmissionChart.options}
                        className="border-1 h-full overflow-hidden rounded-lg bg-white p-4 shadow-sm dark:bg-black"
                        type="pie"
                        height={300}
                    />
                </div>
                <div>
                    <ReactApexChart
                        series={studentsChart.series}
                        options={studentsChart.options}
                        className="h-full overflow-hidden rounded-lg bg-white p-4 shadow-sm dark:bg-black"
                        type="radialBar"
                        height={300}
                    />
                </div>
                <div>
                    {/* <h1 className='text-xl py-2'>Teachers Count</h1> */}
                    <ReactApexChart
                        series={teachersChart.series}
                        options={teachersChart.options}
                        className="border-1 h-full overflow-hidden rounded-lg bg-white p-4 shadow-sm dark:bg-black"
                        type="pie"
                        height={300}
                    />
                </div>
            </div>
            {/* END OF STUDENTS HISTOGRAM CHART */}
        </div>
    );
};

export default Dashboard;
