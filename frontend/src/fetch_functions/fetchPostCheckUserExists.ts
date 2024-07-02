import { TypesOfLogin } from "../components/LogInInputTypes";

async function fetchPostCheckUserExists(typeOfLogin: TypesOfLogin, phone: string, email: string) {
    try {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/auth/user_exists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:
                typeOfLogin == "phone"
                    ? JSON.stringify({
                        phone: phone
                    })
                    : JSON.stringify({
                        email: email
                    })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the /api/auth/user_exists fetch operation:', error);
        throw error;
    }
}

export default fetchPostCheckUserExists