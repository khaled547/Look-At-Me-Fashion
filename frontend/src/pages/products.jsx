import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h2>Products</h2>

      {products.map((item) => (
        <div key={item._id}>
          <h4>{item.name}</h4>
          <p>Price: {item.price}</p>
        </div>
      ))}
    </div>
  );
}
