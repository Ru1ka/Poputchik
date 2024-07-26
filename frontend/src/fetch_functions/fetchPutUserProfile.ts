import { UserInfo } from "../components/Profile/Profile";
import { SERVER_ROUTE } from "../constants";
import { AUTH_PAGE } from "../router/paths";

async function fetchPutUserProfile(userInfo: UserInfo) {
    try {
        if (localStorage.getItem('token') == undefined) {
            window.location.href = AUTH_PAGE;
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json")

        var requestOptions: RequestInit = {
            method: 'PUT',
            headers: myHeaders,
            redirect: 'follow',
            body:
                userInfo.is_organization_account
                    ? JSON.stringify({
                        phone: userInfo.phone,
                        email: userInfo.email,
                        organization: {
                            organization_name: userInfo.organization,
                            inn: userInfo.inn,
                        }
                    })
                    : JSON.stringify({
                        phone: (userInfo.phone == '' || userInfo.phone == '7') ? undefined : userInfo.phone,
                        email: userInfo.email == '' ? undefined : userInfo.email,
                        name: userInfo.name,
                    })
        };
        const response = await fetch(SERVER_ROUTE + '/api/user/me', requestOptions);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the /api/user/me fetch operation:', error);
        throw error;
    }
}

export default fetchPutUserProfile;