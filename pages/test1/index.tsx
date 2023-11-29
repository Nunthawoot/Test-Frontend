import React, { useState, useEffect } from "react";
import DataTest from "@/mock/DataTest.json";
import DataTestType from "@/types/DataTestType";

export default function Test1() {
  const [data, setData] = useState<DataTestType[]>([]);
  const [productCounts, setProductCounts] = useState<
    { type: string; count: number; value: DataTestType[] }[]
  >([]);
  const [inputProduct, setInputProduct] = useState<string>("");

  useEffect(() => {
    setData(DataTest);
    if (DataTest) {
      const counts: {
        [key: string]: { count: number; value: DataTestType[] };
      } = {};
      DataTest.forEach((item) => {
        if (!counts[item.type]) {
          counts[item.type] = { count: 0, value: [] };
        }
        counts[item.type].count += 1;
      });

      const countsArray = Object.entries(counts).map(
        ([type, { count, value }]) => ({
          type,
          count,
          value,
        })
      );

      setProductCounts(countsArray);
    }
  }, []);

  const selectProduct = () => {
    if (inputProduct && data) {
      const selectedProduct = data.find((item) => item.name === inputProduct);

      if (!selectedProduct) {
        for (let index = 0; index < productCounts.length; index++) {
          for (
            let index2 = 0;
            index2 < productCounts[index].value.length;
            index2++
          ) {
            if (productCounts[index].value[index2].name === inputProduct) {
              setProductCounts((prevProductCounts) => {
                const updatedSelectedProduct = [...prevProductCounts];
                const updatedType = {
                  ...updatedSelectedProduct[index],
                  count: updatedSelectedProduct[index].count - 1,
                  value: [
                    ...updatedSelectedProduct[index].value.slice(1, index2),
                  ],
                };

                updatedSelectedProduct[index] = updatedType;

                return updatedSelectedProduct;
              });
              setData((prevData) => {
                const updatedData = [
                  ...prevData,
                  productCounts[index].value[index2],
                ];
                return updatedData;
              });
            }
          }
        }
      } else {
        const existingTypeIndex = productCounts.findIndex(
          (count) => count.type === selectedProduct.type
        );

        if (selectedProduct) {
          const updatedData = data.filter((item) => item.name !== inputProduct);

          setData(updatedData);

          setProductCounts((prevProductCounts) => {
            const updatedSelectedProduct = [...prevProductCounts];

            const updatedType = {
              ...updatedSelectedProduct[existingTypeIndex],
              count: updatedSelectedProduct[existingTypeIndex].count + 1,
              value: [
                ...updatedSelectedProduct[existingTypeIndex].value,
                selectedProduct,
              ],
            };

            updatedSelectedProduct[existingTypeIndex] = updatedType;

            return updatedSelectedProduct;
          });

          setTimeout(() => {
            setProductCounts((prevProductCounts) => {
              const updatedCounts = [...prevProductCounts];

              if (existingTypeIndex !== -1) {
                const updatedType = {
                  ...updatedCounts[existingTypeIndex],
                  count: updatedCounts[existingTypeIndex].count - 1,
                  value: [...updatedCounts[existingTypeIndex].value],
                };

                updatedType.value.shift();
                updatedCounts[existingTypeIndex] = updatedType;
              }

              return updatedCounts;
            });

            setData((prevData) => {
              const updatedData = [...prevData, selectedProduct];
              return updatedData;
            });
          }, 5000);
        }
      }
    }
  };

  return (
    <div className=" container grid grid-cols-9 pt-6 gap-x-8 h-screen ">
      <div className=" col-span-1 space-y-1">
        {data?.map((item) => (
          <div key={item.name}>
            <button
              onClick={() => setInputProduct(item.name)}
              className=" px-5 py-4 border w-full"
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>

      <div className=" col-span-8 flex flex-col pb-8 space-y-4">
        <div>Select product</div>
        <div className="flex gap-x-4">
          <input
            value={inputProduct}
            onChange={(event) => setInputProduct(event.target.value)}
            className=" border w-full px-4 py-3"
          />
          <button onClick={() => selectProduct()} className=" border px-4 py-3">
            Enter
          </button>
        </div>

        <div
          className={`grid grid-cols-${
            productCounts.length || 2
          } h-full gap-x-8`}
        >
          {productCounts.map(({ type, count, value }) => (
            <div key={type} className="border">
              <div className="w-full bg-red-200 text-center py-4">{type}</div>
              <div>
                {value.map((item) => (
                  <div key={item.name} className=" items-center">
                    <button className=" border">{item.name}</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
