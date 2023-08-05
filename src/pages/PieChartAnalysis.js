import PieChart from "../utilities/PieChart"
import { myAxiosAws } from '../services/helperAws';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Loading } from "../utilities/Loading";
export const PieChartAnalysis = () => {
    const navigate = useNavigate();
    const [Data, setData] = useState([]);
    useEffect(() => {
        myAxiosAws.post("/configure", {
            accessKey: localStorage.awsAccessKey,
            secretKey: localStorage.awsSecretKey,
            region: "eu-north-1"
        }).then((response) => response.data).then((response) => console.log(response));

        const fetchData = async () => {
            try {
                const response = await myAxiosAws.get("/total-cost");
                console.log(response);
                const data = response.data.costDetails;
                setData(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    const servicesArray = Data.map((obj) => obj.service_name);
    console.log(servicesArray);
    const costData = Data.map((obj) => obj.cost_per_month);
    console.log(costData);
    return (
        <div>
            {Data ? (<div className="pie-chart-analysis">

                <div className="pie-chart-analysis__pieChart">
                    <PieChart servicesArray={servicesArray} costData={costData} />
                    <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => navigate("/viewservices")}>Go back to table</button>
                </div>
            </div>) : (
                <Loading />
            )}

        </div>
    )
}