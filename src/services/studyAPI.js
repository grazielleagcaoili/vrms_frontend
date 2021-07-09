import axios from 'axios'


export async function onStudyCreate(body) {
    try {
        return axios.post("/v1/studies/createstudy", body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}