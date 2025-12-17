import React, { useEffect, useRef, useState } from "react"
import { IoMdSearch } from "react-icons/io"
import axios from "axios"
import dog from "../assets/osm.webp"
import dog_xss from "../assets/dont_xss.gif"
import "../components/search.css"

const api_url = import.meta.env.VITE_API_URL;

const Subdomain = () => {
  const [value, setValue] = useState("");
  const [data, setData] = useState(["https://mail.google.com"]);
  const [trace, setTrace] = useState(true);
  const [stream, setStream] = useState(null);
  const [msg, setMsg] = useState("");

  let refd = useRef(null);

  function show_Message_Img() {
    if (msg == "") return "";
    if (msg === "Seriously are you try xss...") {
      return <img className="w-[200px] h-[230px]" src={dog_xss} alt="" />;
    }
    if (msg != "") {
      return <img className="w-[200px] h-[200px]" src={dog} alt="" />;
    }
  }

  const cancelRequest = async () => {
    try {
      if (stream) {
        setTrace(true);
        setMsg("");
        refd.current.style.display = "none";
        stream.close();
        await axios.get(`${api_url}/cancel`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
       fetch(`${api_url}/sleep`);
  },[])
  

  const sendRequest = async () => {
    if (!value || value.trim() == "") return;
    setData([]);
    setMsg("");
    setTrace(false);
    refd.current.style.display = "block";
    const eventSource = new EventSource(
      `${api_url}/subdomain?domainName=${value}`
    );

    setStream(eventSource);

    eventSource.onmessage = (event) => {
      let raw = event.data;
      raw = raw.replace("data: ", "");
      raw = raw.trim();
      raw = JSON.parse(raw);
      const final_data = JSON.parse(raw);
      if (final_data.success === false) {
        // console.log("false trigged huaa hai");
        refd.current.style.display = "none";
        setMsg(final_data.msg);
        setTrace(true);
        return;
      }

      refd.current.style.display = "block";
      setData((data) => [...data, final_data.fullResult]);
    };

    eventSource.addEventListener("end", () => {
      // console.log("Scan completed");
      eventSource.close();
      refd.current.style.display = "none";
    setTrace(true);

    });

    eventSource.onerror = () => {
      refd.current.style.display = "none";
      // console.log("Error in stream");
      eventSource.close();
    };
  };

  return (
    <div
      style={{ marginTop: "20px" }}
      className="w-full flex justify-center items-center flex-col"
    >
      <div className="w-full flex justify-center items-center mt-5 flex-col gap-4">
        <div className="flex justify-center items-center flex-col w-[70vw]">
          <h1 className="text-amber-300 font-bold">Important Warning</h1>
          <span>
            This tool is intended strictly for educational and authorized
            security testing purposes only. You may use it only on domains you
            own or on systems where you have explicit permission to test.
            Unauthorized scanning, reconnaissance, or subdomain enumeration on
            external websites is illegal and may result in severe legal
            consequences. All actions performed using this tool are the sole
            responsibility of the user.
          </span>
        </div>
        <div className="w-full flex justify-center items-center gap-4">
          <input
            onChange={(e) => {
              setValue(e.target.value);
            }}
            style={{ border: "2px solid green" }}
            className="outline-none w-[40vw] p-1.5 pl-3 rounded-2xl text-2xl"
            type="text"
            placeholder="Search domain :- google.com"
          />
          <button
            onClick={() => {
              if (trace) {
                sendRequest();
              } else {
                cancelRequest();
              }
            }}
            className="cursor-pointer"
          >
            {trace ? <IoMdSearch size={35} /> : "cancel"}
          </button>
        </div>
        <div style={{ display: "none" }} ref={refd} className="loader"></div>
        {
          <span
            style={{ color: "red", opacity: 0.6 }}
            className="text-2xl text-red-500"
          >
            {msg}
          </span>
        }
        {show_Message_Img()}
      </div>
      <div
        style={{
          border: "2px solid green",
          marginTop: "20px",
          padding: "0px 100px",
        }}
        className="w-1/2 flex flex-col gap-2 p-3"
      >
        {/* result */}
        <span className="text-2xl">Result</span>
        {data.map((data, index) => {
          return (
            <div
              key={index}
              style={{ fontSize: "130%" }}
              className="flex gap-2"
            >
              <span>Live :- </span>
              <a href={data}>{data}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subdomain;
