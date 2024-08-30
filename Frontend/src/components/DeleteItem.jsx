
import axios from "axios";

async function deleteItem() {
try{
    await axios.delete("http://localhost:3000/delete")
}
 catch(err){console.log(err)}
}

export default deleteItem;

