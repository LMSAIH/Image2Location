import axios from 'axios'
import { useState } from 'react';

const Add = () => {

    const [fruitName, setFruitName] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('http://localhost:8000/fruits', { name: fruitName, price: 100 })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }

        return (
            <div className="text-red-600 text-4xl">
                <form onSubmit={handleSubmit}>
                    <input name="fruit" type="text" placeholder='Enter fruit name' value={fruitName} onChange={(e) => { setFruitName(e.target.value) }} />
                    <input type="submit" />
                </form>
            </div>
        );
    }

    export default Add;