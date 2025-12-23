import { useState } from 'react';
import { Plus, Wrench, Trash2, MoreVertical } from 'lucide-react';
import { facilities } from '../../utils/mockData';
import './Assets.css';

function Assets() {
    const [assetList, setAssetList] = useState(facilities);

    const toggleStatus = (id) => {
        setAssetList(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    status: item.status === 'maintenance' ? 'available' : 'maintenance'
                };
            }
            return item;
        }));
    };

    return (
        <div className="assets-page">
            <div className="page-actions">
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Tambah Aset
                </button>
            </div>

            <div className="assets-table-container">
                <table className="assets-table">
                    <thead>
                        <tr>
                            <th>Facility Name</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assetList.map((asset) => (
                            <tr
                                key={asset.id}
                                className={asset.status === 'maintenance' ? 'row-maintenance' : ''}
                            >
                                <td>
                                    <div className="asset-info">
                                        <img src={asset.image} alt="" className="asset-thumb" />
                                        <span className="asset-name">{asset.name}</span>
                                    </div>
                                </td>
                                <td>{asset.building} - {asset.floor}</td>
                                <td>{asset.capacity} Seats</td>
                                <td>
                                    <span className={`status-pill ${asset.status}`}>
                                        {asset.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="row-actions">
                                        <button
                                            className="action-btn"
                                            title="Maintenance Mode"
                                            onClick={() => toggleStatus(asset.id)}
                                        >
                                            <Wrench size={18} className={asset.status === 'maintenance' ? 'text-primary' : ''} />
                                        </button>
                                        <button className="action-btn text-danger" title="Remove">
                                            <Trash2 size={18} />
                                        </button>
                                        <button className="action-btn" title="More">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Assets;
