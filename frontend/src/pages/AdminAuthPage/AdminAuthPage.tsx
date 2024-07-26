import AdminAuth from '../../components/AdminAuth';
import CenteredFrame from '../../components/CenteredFrame'


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