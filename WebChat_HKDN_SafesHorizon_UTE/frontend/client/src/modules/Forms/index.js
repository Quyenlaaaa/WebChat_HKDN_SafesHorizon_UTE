import { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import returnIcon from '../../assets/return.jpg';
import eyeIcon from '../../assets/view.png'; 
import eyeSlashIcon from '../../assets/hide.png'; 
import { useNavigate } from 'react-router-dom';

const Form = ({ isSignInPage = true, isForgotPasswordPage = false }) => {
    const [data, setData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [userCaptchaInput, setUserCaptchaInput] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); 
    const navigate = useNavigate();

    const [savedAccounts, setSavedAccounts] = useState([]);
    const [showAccountList, setShowAccountList] = useState(false); // State để kiểm soát sự hiển thị của danh sách tài khoản

    useEffect(() => {
        const accounts = JSON.parse(localStorage.getItem('savedAccounts')) || [];
        setSavedAccounts(accounts);
    }, []);

    function generateCaptcha() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isForgotPasswordPage) {
            if (!data.email) {
                setError("Vui lòng nhập email.");
                setTimeout(() => setError(""), 1000); // Ẩn thông báo sau 1 giây
                return;
            }
            if (userCaptchaInput !== captcha) {
                setError("Mã CAPTCHA không chính xác.");
                setCaptcha(generateCaptcha());
                setUserCaptchaInput("");
                setTimeout(() => setError(""), 1000); // Ẩn thông báo sau 1 giây
                return;
            }

            setSuccessMessage("Mật khẩu mới đã được gửi về email của bạn.");
            setTimeout(() => {
                setSuccessMessage(""); 
                navigate("/users/sign_in");
            }, 700);
        } else {
            if (!data.password || !data.confirmPassword && !isSignInPage) {
                setError("Vui lòng nhập đầy đủ mật khẩu.");
                setTimeout(() => setError(""), 1000); // Ẩn thông báo sau 1 giây
                return;
            }
            if (data.password !== data.confirmPassword && !isSignInPage) {
                setError("Mật khẩu và xác nhận mật khẩu không khớp.");
                setTimeout(() => setError(""), 1000); // Ẩn thông báo sau 1 giây
                return;
            }
            console.log('Form data:', data);
            localStorage.setItem('user:token', 'mocked_token');
            saveAccount(data.email);
            setSuccessMessage("Đăng nhập thành công.");
            setTimeout(() => {
                setSuccessMessage("");
                navigate('/');
            }, 700);
        }
    };
    
    const saveAccount = (email) => {
        const accounts = JSON.parse(localStorage.getItem('savedAccounts')) || [];
        if (!accounts.includes(email)) {
            accounts.push(email);
            localStorage.setItem('savedAccounts', JSON.stringify(accounts));
            setSavedAccounts(accounts);
        }
    };

    const handleAccountSelect = (account) => {
        setData({ ...data, email: account });
        setShowAccountList(false); // Ẩn danh sách sau khi chọn tài khoản
    };

    const handleEmailFocus = () => {
        setShowAccountList(true); // Hiển thị danh sách tài khoản đã lưu khi ô nhập email được chọn
    };

    const handleEmailBlur = () => {
        setTimeout(() => {
            setShowAccountList(false); // Ẩn danh sách sau một khoảng thời gian khi không còn tập trung vào ô nhập
        }, 200); // Thời gian này giúp cho việc chọn tài khoản có thể diễn ra mà không bị ẩn
    };

    return (
        <div className="bg-light h-screen flex items-center justify-center">
            <div className="bg-white w-[600px] h-[800px] shadow-lg rounded-lg flex flex-col justify-center items-center">
                <div className="text-4xl font-extrabold">
                    {isSignInPage ? 'ĐĂNG NHẬP' : isForgotPasswordPage ? 'QUÊN MẬT KHẨU' : 'ĐĂNG KÝ'}
                </div>
                <div className="text-xl font-light mb-14">
                    {isSignInPage ? 'Chào mừng quay trở lại' : isForgotPasswordPage ? 'Vui lòng nhập email để lấy lại mật khẩu' : 'Hãy trải nghiệm ngay nào'}
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>} 
                {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>} 
                <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
                    <Input 
                        label="Email" 
                        type="email" 
                        name="email" 
                        placeholder="Nhập email" 
                        className="mb-6 w-[75%]" 
                        value={data.email} 
                        onChange={(e) => setData({ ...data, email: e.target.value }) }
                        onFocus={handleEmailFocus} // Hiển thị danh sách khi ô nhập được chọn
                        onBlur={handleEmailBlur} // Ẩn danh sách khi ô nhập mất tập trung
                    />
                    {showAccountList && savedAccounts.length > 0 && (
                        <div className="absolute bg-white border border-gray-300 w-[75%] z-10">
                            <p className="text-sm font-medium text-gray-800">Tài khoản đã lưu:</p>
                            <ul className="list-disc pl-5">
                                {savedAccounts.map((account, index) => (
                                    <li 
                                        key={index} 
                                        className="cursor-pointer text-blue-500 underline" 
                                        onClick={() => handleAccountSelect(account)}
                                    >
                                        {account}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {!isForgotPasswordPage && (
                        <>
                            <div className="relative mb-6 w-[75%]">
                                <Input 
                                    label="Mật khẩu" 
                                    type={showPassword ? 'text' : 'password'} 
                                    name="password" 
                                    placeholder="Nhập mật khẩu" 
                                    className="w-full" 
                                    value={data.password} 
                                    onChange={(e) => setData({ ...data, password: e.target.value }) }
                                />
                                <button 
                                    type="button" 
                                    className="absolute right-3 top-3" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <img 
                                        src={showPassword ? eyeSlashIcon : eyeIcon} 
                                        alt={showPassword ? "Hide password" : "Show password"} 
                                        style={{ width: '20px', height: '20px', marginTop: '20px' }} 
                                    />
                                </button>
                            </div>
                            {!isSignInPage && (
                                <div className="relative mb-14 w-[75%]">
                                    <Input 
                                        label="Nhập lại mật khẩu" 
                                        type={showConfirmPassword ? 'text' : 'password'} 
                                        name="confirmPassword" 
                                        placeholder="Nhập lại mật khẩu" 
                                        className="w-full" 
                                        value={data.confirmPassword} 
                                        onChange={(e) => setData({ ...data, confirmPassword: e.target.value }) }
                                    />
                                    <button 
                                        type="button" 
                                        className="absolute right-3 top-3" 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <img 
                                            src={showConfirmPassword ? eyeSlashIcon : eyeIcon} 
                                            alt={showConfirmPassword ? "Hide password" : "Show password"} 
                                            style={{ width: '20px', height: '20px', marginTop: '20px' }} 
                                        />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    {isForgotPasswordPage && (
                        <>
                            <div className="text-xl font-light mb-14">
                                <span>{captcha}</span>
                                <button 
                                    type="button" 
                                    onClick={() => setCaptcha(generateCaptcha())} 
                                    className="ml-4"
                                >
                                    <img src={returnIcon} alt="Reload CAPTCHA" style={{ width: '20px', height: '20px' }}/>
                                </button>
                            </div>
                            <Input 
                                label="Nhập mã CAPTCHA" 
                                type="text" 
                                name="captcha" 
                                placeholder="Nhập mã CAPTCHA" 
                                className="mb-6 w-[75%]" 
                                value={userCaptchaInput} 
                                onChange={(e) => setUserCaptchaInput(e.target.value)} 
                            />
                            <div className="text-red-500 mb-4"></div>
                        </>
                    )}
                    <Button label={isSignInPage ? 'Sign in' : isForgotPasswordPage ? 'Gửi yêu cầu' : 'Sign up'} type="submit" className="w-[75%] mb-2" />
                </form>
                {isSignInPage && (
                    <div className="mt-4">
                        <span className="text-primary cursor-pointer underline" onClick={() => navigate('/forgot_password')}>
                            Quên mật khẩu?
                        </span>
                    </div>
                )}
                <div>{isSignInPage ? "Bạn chưa có tài khoản? " : "Bạn đã có tài khoản? "} 
                    <span className="text-primary cursor-pointer underline" onClick={() => navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)}>
                        {isSignInPage ? 'Tạo tài khoản' : 'Đăng nhập'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Form;
