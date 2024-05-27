import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
function LeaveForm() {
  const [data, setData] = useState([]);

  const [value, setValue] = useState("Pending");

  const notifySuccess = (txt) => toast.success(txt);
  const notifyError = (txt) => toast.error(txt);

  useEffect(() => {
    try {
      axios
        .get("https://phs.azzappointments.com/apis/public/api/admin/leaves")
        .then((res) => {
          setData(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  //console.log(data);

  return (
    <section className=" py-5 w-full px-5 ">
      <div className="pb-5 font-semibold text-xl text-center">Leave Form</div>
      <div>
        <Toaster />
      </div>
      <select
        defaultValue={value}
        onChange={(e) => setValue(e.target.value)}
        className="select  select-warning w-full max-w-xs"
      >
        <option value="Pending">Pending</option>
        <option value="approved">Approved</option>
      </select>

      <br />
      <br />

      <section className="overflow-x-auto">
        <table className="table relative w-full border">
          {/* head */}
          <thead className="">
            <tr className="border border-black">
              <th className=" border border-black sticky top-0 px-2 py-2 text-black bg-appColor text-center">
                ID
              </th>
              <th className="border border-black sticky top-0 px-2 py-2 text-black bg-appColor text-center">
                Name
              </th>
              <th className="border border-black sticky top-0 px-2 py-2 text-black bg-appColor text-center">
                E-mail
              </th>
              <th className="border border-black sticky top-0 px-2 py-2 text-black bg-appColor text-center">
                HoD
              </th>
              <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor text-center">
                Department
              </th>
              <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor text-center">
                Start Date
              </th>
              <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor text-center">
                End Date
              </th>
              <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor text-center">
                Type of Leave
              </th>
              <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor text-center">
                Reason of Leave
              </th>
              <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor text-center">
                Reliever Name
              </th>

              <th className="border border-black sticky top-0 px-6 py-3 text-black bg-appColor text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="mt-20">
            {data
              .map((i) => i)
              .filter((filter) => filter.status.includes(value))
              .map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-appColor/20 border border-black"
                >
                  <td className="text-center font-medium border border-black">
                    {item.employee_id.replace("EMP", "")}
                  </td>
                  <td className="text-left font-medium border border-black">
                    {item.employee_name}
                  </td>
                  <td className="text-left font-medium border border-black">
                    {item.email_address}
                  </td>
                  <td className="text-left font-medium border border-black">
                    {item.hod}
                  </td>
                  <td className="text-left font-medium border border-black">
                    {item.department}
                  </td>
                  <td className="text-left font-medium border border-black">
                    {item.start_date.substring(0, 10)}
                  </td>
                  <td className="text-left font-medium border border-black">
                    {item.end_date.substring(0, 10)}
                  </td>
                  <td className="text-left font-medium border border-black">
                    {item.type_of_leave}
                  </td>
                  <td className="text-left font-medium border border-black">
                    {item.reason_of_leave}
                  </td>
                  <td className="text-left font-medium border border-black">
                    {item.reliever_name}
                  </td>
                  {/* Add other cells as needed */}
                  <td className="text-center font-medium border border-black">
                    {item.status === "approved" ? (
                      "Approved"
                    ) : (
                      <button
                        onClick={() => {
                          let data = "";

                          let config = {
                            method: "get",
                            maxBodyLength: Infinity,
                            url: `https://phs.azzappointments.com/apis/public/api/admin/update-leaves/${item.id}`,
                            headers: {
                              ...data,
                            },
                          };

                          axios
                            .request(config)
                            .then((response) => {
                              notifySuccess(response.data.message);

                              //console.log(JSON.stringify(response.data));

                              try {
                                axios
                                  .get(
                                    "https://phs.azzappointments.com/apis/public/api/admin/leaves"
                                  )
                                  .then((res) => {
                                    setData(res.data);
                                  });
                              } catch (error) {
                                console.log(error);
                              }
                            })
                            .catch((error) => {
                              console.log(error);
                              notifyError(error);
                            });
                        }}
                        className="btn btn-outline btn-sm btn-warning"
                      >
                        {item.status}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

export default LeaveForm;
