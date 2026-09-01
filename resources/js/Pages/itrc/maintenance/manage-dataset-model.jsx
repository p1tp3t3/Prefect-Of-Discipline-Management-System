import UploadFileBtn from "@/Components/button/upload-file-btn";
import { useState } from "react";

const ManageDatasetModel = (props) => {

    const [datasets, setDatasets] = useState([
        { id: 1, name: 'Student Records', size: '1.2 MB', lastUpdated: '2023-12-01', status: 'Ready' },
        { id: 2, name: 'Incident Logs', size: '500 KB', lastUpdated: '2023-11-30', status: 'Processing' },
        { id: 3, name: 'Risk Scores', size: '800 KB', lastUpdated: '2023-12-02', status: 'Ready' },
    ]);

    const [trainingStatus, setTrainingStatus] = useState({
        isTraining: false,
        progress: 0,
        logs: ['Model training initialized...', 'Loading datasets...', 'Preprocessing data...'],
        lastTrained: '2023-12-01 10:00:00'
    });


    const addDataset = () => {
        const newDataset = { id: datasets.length + 1, name: 'New Dataset', size: '0 KB', lastUpdated: new Date().toISOString().split('T')[0], status: 'Uploading' };
        setDatasets([...datasets, newDataset]);
    };

    const startTraining = () => {
        setTrainingStatus(prev => ({ ...prev, isTraining: true, progress: 0, logs: ['Starting model training...'] }));
        // Simulate training progress
        const interval = setInterval(() => {
            setTrainingStatus(prev => {
                const newProgress = prev.progress + 10;
                const newLogs = [...prev.logs, `Training progress: ${newProgress}%`];
                if (newProgress >= 100) {
                    clearInterval(interval);
                    return { ...prev, isTraining: false, progress: 100, logs: [...newLogs, 'Training completed!'], lastTrained: new Date().toLocaleString() };
                }
                return { ...prev, progress: newProgress, logs: newLogs };
            });
        }, 1000);
    };

    return (
        <div className="flex-1 flex flex-col gap-6">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Logistic Regression Datasets</h2>
                    <div>
                        <UploadFileBtn 
                            name='csv-upload' 
                            accept='.csv' 
                        >
                            <i className="fa-solid fa-upload"></i> Upload Dataset
                        </UploadFileBtn>
                    </div>
                </div>
                <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">#</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Size</th>
                            <th className="px-4 py-2 text-left">Last Updated</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Accuracy</th>
                            <th className="px-4 py-2 text-left">Precision</th>
                            <th className="px-4 py-2 text-left">Recall</th>
                            <th className="px-4 py-2 text-left">F1 Score</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datasets.map((dataset, i) => (
                            <tr key={dataset.id} className="border-t text-[0.9em]">
                                <td className="px-4 py-2">{i + 1}.</td>
                                <td className="px-4 py-2">{dataset.name}</td>
                                <td className="px-4 py-2">{dataset.size}</td>
                                <td className="px-4 py-2">{dataset.lastUpdated}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded text-sm ${dataset.status === 'Ready' ? 'bg-green-100 text-green-800' : dataset.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {dataset.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">12%</td>
                                <td className="px-4 py-2">12%</td>
                                <td className="px-4 py-2">12%</td>
                                <td className="px-4 py-2">12%</td>
                                <td className="px-4 py-2">
                                    <button className="text-blue-500 hover:underline mr-2">Select</button>
                                    <button className="text-blue-500 hover:underline mr-2">View</button>
                                    <button className="text-green-500 hover:underline mr-2">Export</button>
                                    <button className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4">Model Training</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-600">Last Trained: {trainingStatus.lastTrained}</p>
                        <button 
                            onClick={startTraining} 
                            disabled={trainingStatus.isTraining} 
                            className={`px-4 py-2 rounded ${trainingStatus.isTraining ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white`}
                        >
                            {trainingStatus.isTraining ? 'Training...' : 'Start Training'}
                        </button>
                    </div>
                    {trainingStatus.isTraining && (
                        <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${trainingStatus.progress}%` }}></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Progress: {trainingStatus.progress}%</p>
                        </div>
                    )}
                    <div className="bg-gray-100 p-3 rounded max-h-40 overflow-y-auto">
                        <h3 className="font-semibold mb-2">Training Logs</h3>
                        <ul className="text-sm space-y-1">
                            {trainingStatus.logs.map((log, index) => (
                                <li key={index} className="text-gray-700">{log}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageDatasetModel