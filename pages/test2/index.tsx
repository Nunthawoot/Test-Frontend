import React, { useEffect, useState } from "react";
import { GroupedData, Root, User } from "@/types/UsersType";


const calculateMode = (arr: number[]): number => {
  const frequency: { [key: number]: number } = {};
  arr.forEach((num) => {
    frequency[num] = (frequency[num] || 0) + 1;
  });

  let mode: number[] = [];
  let maxFrequency = 0;

  for (const key in frequency) {
    if (frequency[key] > maxFrequency) {
      mode = [Number(key)];
      maxFrequency = frequency[key];
    } else if (frequency[key] === maxFrequency) {
      mode.push(Number(key));
    }
  }

  return mode.length === arr.length ? 0 : mode[0];
};

export default function Test2() {
  const [userData, setUserData] = useState<GroupedData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/users");
        const responseData: Root = await response.json();

        // users is array
        if (!Array.isArray(responseData.users)) {
          return;
        }

        const data: User[] = responseData.users;

        // Group data
        const groupedData: GroupedData = data.reduce(
          (item: GroupedData, user: User) => {
            const department = user.company.department;
            if (!item[department]) {
              item[department] = {
                male: 0,
                female: 0,
                ageRange: "",
                ageMode: 0,
                hair: {},
                addressUser: {},
              };
            }

            // gender count
            user.gender === "male"
              ? item[department].male++
              : item[department].female++;

            // hair color count
            if (user.hair && user.hair.color) {
              item[department].hair[user.hair.color] =
                (item[department].hair[user.hair.color] || 0) + 1;
            }

            // address count
            if (user.address && user.address.address) {
              const fullName = `${user.firstName} ${user.lastName}`;
              const fullAddress = `${fullName}: ${user.address.address}`;
              item[department].addressUser[fullAddress] =
                item[department].addressUser[fullAddress];
            }

            // ageRange
            const userAge = user.age;
            if (userAge !== undefined) {
              if (!item[department].ageRange) {
                item[department].ageRange = `${userAge}`;
              } else if (item[department].ageRange.includes("-")) {
                const [minAge, maxAge] = item[department].ageRange
                  .split(" - ")
                  .map(Number);
                item[department].ageRange = `${Math.min(
                  minAge,
                  userAge
                )} - ${Math.max(maxAge, userAge)}`;
              } else {
                item[
                  department
                ].ageRange = `${item[department].ageRange} - ${userAge}`;
              }
            }

            // ageMode
            if (user.age !== undefined) {
              if (!item[department].ageMode) {
                item[department].ageMode = user.age;
              } else {
                const ageModeArray = [item[department].ageMode, user.age];
                item[department].ageMode = calculateMode(ageModeArray);
              }
            }

            return item;
          },
          {} as GroupedData
        );

        setUserData(groupedData);
      } catch (error) {
        console.error("Error fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=" container">
      <div className=" text-center py-6 text-[32px] font-semibold">Test2</div>
      {userData && (
        <div className=" grid grid-cols-3 gap-6">
          {Object.keys(userData).map((department) => (
            <div key={department} className=" p-4 border">
              <h2>{department}</h2>
              <p>Male: {userData[department].male}</p>
              <p>Female: {userData[department].female}</p>
              <p>Age Range: {userData[department].ageRange}</p>
              <p>Age Mode: {userData[department].ageMode}</p>
              <div>
                <div>Hair Colors:</div>
                <div className="pl-6">
                  <ul>
                    {Object.keys(userData[department].hair).map((color) => (
                      <li
                        key={color}
                      >{`${color}: ${userData[department].hair[color]}`}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div>Addresses:</div>
                <div className="pl-6">
                  <ul>
                    {Object.keys(userData[department].addressUser).map(
                      (address) => (
                        <li key={address}>
                          <div>{address}</div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
