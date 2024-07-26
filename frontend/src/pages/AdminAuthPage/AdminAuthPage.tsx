import { useContext } from 'react';
import AdminAuth from '../../components/AdminAuth';
import CenteredFrame from '../../components/CenteredFrame'
import { ModalContext } from '../../components/Modal/ModalContext';


function AdminAuthPage() {
    return (
        <div >
            <CenteredFrame showBackArrow={false} clickBackArrowHandler={() => { }}>
                <AdminAuth />
            </CenteredFrame>
        </div>
    )
};

export default AdminAuthPage;