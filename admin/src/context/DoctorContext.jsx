import { createContext, useState, useMemo } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const getAppointments = async () => {
        setLoadingAppointments(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { headers: { dToken } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoadingAppointments(false);
        }
    };

    const getProfileData = async () => {
        setLoadingProfile(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers: { dToken } });
            setProfileData(data.profileData);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoadingProfile(false);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId }, { headers: { dToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId }, { headers: { dToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, { headers: { dToken } });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const value = useMemo(() => ({
        dToken, setDToken, backendUrl,
        appointments,
        loadingAppointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        loadingProfile,
        getProfileData,
    }), [dToken, appointments, dashData, profileData]);

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;