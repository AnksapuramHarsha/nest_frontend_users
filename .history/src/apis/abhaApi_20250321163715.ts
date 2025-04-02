import axios from "axios";

const abhaVerification= async()=>{
    try{
        await axios.post(``) 
    }
}


try {
    const response = await axios.post("http://127.0.0.1:3000/abha/verify", {
        firstName: formData.nameGiven,
        lastName: formData.nameFamily,
        abhaNumber: formData.abha
    });

    setVerificationStatus(response.data.status); // "Verified" or "Not Verified"
}