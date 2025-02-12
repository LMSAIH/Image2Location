import { useEffect, useState } from 'react'
import axios from 'axios'

type Fruit = {
    name:string,
    price:number
}

const Home = () => {

    const [fruits, setFruits] = useState<Fruit[]>([])
    
    useEffect(() => {
        axios.get('http://localhost:8000/fruits')
            .then(res=> {
                setFruits(res.data.fruits)
            })
            .catch(err => {
                console.log(err)
            })
    }, [fruits])

    return (
        <div>
            <h1 className="text-center text-4xl text-blue-600"> Homepage </h1>
            <div className="fruitcontainer flex flex-row justify-center">
                {fruits && fruits.map((fruit) => (
                    <div key={fruit.name} className="text-center text-2xl text-black">
                        {fruit.name} - ${fruit.price}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;