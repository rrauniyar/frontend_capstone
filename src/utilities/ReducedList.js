import React, { useState } from 'react';
import { Slider, Typography, ListItemText } from '@material-ui/core';
import { myAxiosDs } from '../services/helperDs';
import { Discuss } from 'react-loader-spinner';
import { useEffect } from 'react';

export const ReducedList = (props) => {
    const data = props.data;

    const [OriginalData, setOriginalData] = useState([]);

    useEffect(() => {
        const copiedData = JSON.parse(JSON.stringify(data));
        setOriginalData(copiedData);
    }, [data]);


    const jsonData = props.data;
    const [instanceData, setInstanceData] = useState(jsonData);

    const handleVcpuChange = (event, value, index) => {
        setInstanceData(prevData => {
            const newData = [...prevData];
            newData[index].vcpu = value;
            return newData;
        });
    };

    const handleMemoryChange = (event, value, index) => {
        setInstanceData(prevData => {
            const newData = [...prevData];
            newData[index].memoryInGib = value;
            return newData;
        });
    };

    const handleCpuUtilizationChange = (event, value, index) => {
        setInstanceData(prevData => {
            const newData = [...prevData];
            newData[index].averageCpuUtilization = value;
            return newData;
        })
    }


    const stringifyData = JSON.stringify(instanceData);
    const stringifyOriginalData=JSON.stringify(OriginalData);
    console.log(stringifyData);
    console.log(stringifyOriginalData);
    async function HandleOptimize() {
        setOptimizedData("loading");
        const response = await myAxiosDs.post("/chat", {
            role: "AWS_ec2",
            message: stringifyOriginalData + '+' + stringifyData
        }).then((response) => response.data).then((response) => {
            setOptimizedData(response.text);
            console.log(response);
        });

        console.log(response);
    }



    const [optimizedData, setOptimizedData] = useState("");

    console.log(instanceData);

    return (
        <div>
            <div>
                {instanceData.map((item, index) => (

                    <div key={item.instanceId} >
                        <ListItemText primary={index + 1} />
                        <ListItemText
                            primary={`Instance ID: ${item.instanceId}`}
                            secondary={`Instance Name: ${item.instanceName}`}
                        />
                        <div>
                            <Typography >vCPU:</Typography>
                            <Slider
                                value={item.vcpu}
                                min={1}
                                max={256}
                                onChange={(event, value) => handleVcpuChange(event, value, index)}
                                valueLabelDisplay="auto"
                                aria-labelledby="vcpu-slider"

                            />
                            <Typography >Memory:</Typography>
                            <Slider
                                value={item.memoryInGib}
                                min={1}
                                max={1024}
                                onChange={(event, value) => handleMemoryChange(event, value, index)}
                                valueLabelDisplay="auto"
                                aria-labelledby="memory-slider"

                            />

                            <Typography >Cpu Utilization:</Typography>
                            <Slider
                                value={item.averageCpuUtilization}
                                min={0}
                                max={60}
                                step={0.03}
                                onChange={(event, value) => handleCpuUtilizationChange(event, value, index)}
                                valueLabelDisplay="auto"
                                aria-labelledby="memory-slider"

                            />

                        </div>
                    </div>
                ))}
            </div>

            <button className="green focus dark" style={{ marginTop: "60px", marginLeft: "0", height: "50px", width: "100px" }} onClick={HandleOptimize}>Reduce</button>
            {optimizedData === null ? (
                <div>

                </div>
            ) : (
                <div>
                    {optimizedData === "loading" ? (
                        <div>
                            <Discuss />
                        </div>
                    ) : (
                        <div className="optimizedData">{optimizedData}</div>
                    )}
                </div>
            )}
        </div>
    );
};


