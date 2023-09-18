// school/dashboard-stats/

export const getDashboardStats = async (schoolID: string, access_token?: string) => {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/dashboard-stats/' + schoolID, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json',
            Authorization: 'Bearer ' + access_token,
        },
    });
    let tempData = await res.json();
    if (res.ok) {
        return tempData.data;
    } else {
        return {
            error: true,
        };
    }
};
