import { useEffect } from 'react'
import DashboardOverview from './DashboardOverview'
import { FaBoxOpen, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { analyticsAction } from '../../../store/actions';
import Loader from '../../shared/Loader';
import ErrorPage from '../../shared/ErrorPage';

const Dashboard = () => {
    const dispatch = useDispatch();
    const {isLoading, errorMessage} = useSelector((state) => state.errors);
    const {
        analytics: { productCount, totalRevenue, totalOrders },
    } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(analyticsAction());
    }, [dispatch]);

    if (isLoading) {
        return <Loader />
    }

    if (errorMessage) {
        return <ErrorPage message={errorMessage}/>;
    }

    return (
        <section className="mx-auto max-w-7xl space-y-8">
            <header className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />

                <div className="relative">
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                        Admin workspace
                    </span>
                    <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                        Dashboard overview
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                        A quick snapshot of your catalog, customer orders, and store revenue.
                    </p>
                </div>
            </header>

            <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                            Store performance
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-slate-900">
                            Key metrics
                        </h2>
                    </div>
                    <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
                        Live overview
                    </span>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <DashboardOverview
                    title="Total Products"
                    amount={productCount}
                    Icon={FaBoxOpen}
                    description="Products currently in your catalog"
                    tone="blue"
                />

                <DashboardOverview
                    title="Total Orders"
                    amount={totalOrders}
                    Icon={FaShoppingCart}
                    description="Orders received by your store"
                    tone="violet"
                />

                <DashboardOverview
                    title="Total Revenue"
                    amount={totalRevenue}
                    Icon={FaDollarSign}
                    description="Revenue generated from all orders"
                    tone="emerald"
                    revenue
                />
                </div>
            </div>
        </section>
    )
}

export default Dashboard
