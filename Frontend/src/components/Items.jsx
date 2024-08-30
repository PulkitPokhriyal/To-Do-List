import React, { useEffect, useState } from "react";
import axios from "axios";
import deleteItem from "./DeleteItem";

function Item() {
    const [items, setItems] = useState([]);
    const [lineThroughState, setLineThroughState] = useState({});
    const [content, setContent] = useState({});
    const [newItem, setNewItem] = useState(""); 

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("http://localhost:3000/");
                setItems(response.data.items);
                const initialLineThroughState = {};
                response.data.items.forEach((item, index) => {
                    initialLineThroughState[index] = false;
                });
                setLineThroughState(initialLineThroughState);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        }

        fetchData();
    }, []);

    function handleClick(index) {
        setLineThroughState(prevState => {
            const newState = { ...prevState, [index]: !prevState[index] };
            const allLineThrough = Object.values(newState).every(value => value);

            if (allLineThrough) {
                deleteItem().then(() => {
                    window.location.href = "http://localhost:5173/";
                });
            }
            localStorage.setItem("lineThroughState", JSON.stringify(newState));
            return newState;
        });
    }

    async function editContent(itemId) {
        setContent(prevValue => ({
            ...prevValue,
            [itemId]: true
        }));

        try {
            await axios.patch(`http://localhost:3000/edit/${itemId}`, { newItem }); 
            setContent(prevValue => ({
                ...prevValue,
                [itemId]: false
            }));
        } catch (err) {
            console.log(err);
        }
    }

    function handleInput(event, itemId) {
        setNewItem(event.target.textContent);
    }

    function handleKeyDown(event, itemId) {
        if (event.key === "Enter") {
            event.preventDefault();
            editContent(itemId);
        } 
    }

    return (
        <ul className="flex flex-col gap-1.5 mt-7"> 
            {items.map((item, index) => (
                <li 
                    key={index}  
                    className="-skew-y-12 text-2xl md:text-2xl lg:text-3xl pacifico-regular flex justify-center"
                >
                    <span  
                        onClick={() => handleClick(index)} 
                        onDoubleClick={() => editContent(item.id)}
                        onInput={(e) => handleInput(e, item.id)} 
                        onKeyDown={(e) => handleKeyDown(e, item.id)}
                        contentEditable={content[item.id]}
                        style={{ 
                            marginLeft: `${index * 15}px`, 
                            textDecoration: lineThroughState[index] ? "line-through" : "none" 
                        }}
                        required
                    >  
                        {item.items}
                    </span>
                </li>
            ))}
        </ul>
    );
}

export default Item;
