import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import type { CartItem } from "../types/CartItem";

function DonatePage() {

    const navigate = useNavigate();
    const {projectName, projectId} = useParams();
    const {addToCart} = useCart();
    const [donationAmount, setDonationAmount] = useState<number>(0);
    

    const handleAddToCart = () => {
        const newItem: CartItem = {
            projectId: Number(projectId),
            projectName: projectName || "No Project Found",
            donationAmount
        }
        addToCart(newItem);
        navigate('/cart');

    }

return (
    <>
    <WelcomeBand />
    <h2>Donate to {projectName}</h2>
    

    <div>
        <input type="number" placeholder="Enter donation amount" value={donationAmount} onChange={(e) => setDonationAmount(Number(e.target.value))} />
        <button onClick={handleAddToCart}>Add To Cart</button>
    </div>
    
    <button onClick={() => navigate(-1)}>Back</button>
    </>

);

}

export default DonatePage;