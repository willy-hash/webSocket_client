import { useState, useEffect, useRef } from 'react';
import { DollarSign, User, Calendar, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import './page2.css';


function Page2() {

    const [pagos, setPagos] = useState([]); //array de pagos

    const [isConnected, setIsConnected] = useState(false); //estado de la conexion
    const socketRef = useRef(null); //referencia al socket

    const connectSocket = () => {
        if (socketRef.current?.connected) {
            console.warn("El socket ya está conectado");
            return;
        }

        import('https://cdn.socket.io/4.5.4/socket.io.esm.min.js').then((module) => {
            const { io } = module;

            socketRef.current = io("https://test-nack-android.onrender.com", { //http://localhost:8000
                transports: ["websocket"],
                reconnection: true,
                reconnectionAttempts: 5,
            });

            socketRef.current.on("connect", () => {
                console.log("Socket conectado:", socketRef.current.id);
                setIsConnected(true);
            });

            socketRef.current.on("connect_error", (err) => {
                console.error("Error de conexión:", err.message);
                setIsConnected(false);
            });

            socketRef.current.on("disconnect", (reason) => {
                console.warn("Socket desconectado:", reason);
                setIsConnected(false);
            });

            socketRef.current.on("nuevo_pago", (nuevoPago) => {

                console.log("Nuevo pago recibido:", nuevoPago); //******************************** */

                setPagos(prevPagos => [...prevPagos, nuevoPago]);
            });


        }).catch((err) => {
            console.error("Error al cargar socket.io:", err);
        });
    };

    const disconnectSocket = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    };

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const total = pagos.reduce((sum, pago) => sum + pago.valor, 0);
    const promedio = pagos.length > 0 ? Math.round(total / pagos.length) : 0;
    const mayorPago = pagos.length > 0 ? Math.max(...pagos.map(p => p.valor)) : 0;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (dateString) => {

        const date = new Date(dateString).toLocaleString('es-CO', {
            timeZone: 'America/Bogota'
        });

        return date;
    };

    return (
        <div className="page-container">
            <div className="dashboard-wrapper">
                <div className="dashboard-content">
                    {/* Header */}
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Dashboard de Pagos</h1>

                        <div className="button-group">
                            <button
                                onClick={connectSocket}
                                disabled={isConnected}
                                className={`btn btn-connect ${isConnected ? 'btn-disabled' : ''}`}
                            >
                                <Wifi size={20} />
                                {isConnected ? 'Conectado' : 'Conectar'}
                            </button>

                            <button
                                onClick={disconnectSocket}
                                disabled={!isConnected}
                                className={`btn btn-disconnect ${!isConnected ? 'btn-disabled' : ''}`}
                            >
                                <WifiOff size={20} />
                                Desconectar
                            </button>
                        </div>
                    </div>

                    {/* Connection Status */}
                    <div className={`status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
                        <div className="status-dot"></div>
                        <span className="status-text">
                            {isConnected ? 'Conectado al servidor en tiempo real' : 'Sin conexión - Mostrando datos locales'}
                        </span>
                    </div>

                    {/* Summary Cards */}
                    <div className="cards-grid">
                        <div className="card card-green">
                            <div className="card-content">
                                <div className="card-info">
                                    <p className="card-label">Total Recaudado</p>
                                    <p className="card-value">{formatCurrency(total)}</p>
                                </div>
                                <div className="card-icon icon-green">
                                    <DollarSign size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="card card-blue">
                            <div className="card-content">
                                <div className="card-info">
                                    <p className="card-label">Promedio por Pago</p>
                                    <p className="card-value">{formatCurrency(promedio)}</p>
                                </div>
                                <div className="card-icon icon-blue">
                                    <TrendingUp size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="card card-purple">
                            <div className="card-content">
                                <div className="card-info">
                                    <p className="card-label">Mayor Pago</p>
                                    <p className="card-value">{formatCurrency(mayorPago)}</p>
                                </div>
                                <div className="card-icon icon-purple">
                                    <User size={32} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-container">
                        <div className="table-header">
                            <h2 className="table-title">Detalle de Pagos</h2>
                        </div>

                        <div className="table-wrapper">
                            <table className="pagos-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Cobrador</th>
                                        <th>Cliente</th>
                                        <th>Valor</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagos.map((pago) => (
                                        <tr key={pago.id}>
                                            <td className="td-id">#{pago.id}</td>
                                            <td>
                                                <div className="cobrador-cell">
                                                    <div className="cobrador-avatar">
                                                        <User size={20} />
                                                    </div>
                                                    <div className="cobrador-name">{pago.id_cobrador}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="client-cell">
                                                    <div className="client-avatar">
                                                        <User size={20} />
                                                    </div>
                                                    <div className="client-name">{pago.cliente}</div>
                                                </div>
                                            </td>
                                            <td className="td-value">{formatCurrency(pago.valor)}</td>
                                            <td className="td-date">
                                                <div className="date-cell">
                                                    <Calendar size={16} />
                                                    {formatDate(pago.created_at)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="table-footer">
                            <span className="footer-records">
                                Total de pagos: {pagos.length}
                            </span>
                            <span className="footer-total">
                                Total: {formatCurrency(total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page2;