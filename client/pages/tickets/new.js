import { useState } from "react";
import Router from "next/router";
import userequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [enableSave, setEnableSave] = useState(false);
  const { doRequest, errors } = userequest({
    url: `/api/tickets`,
    method: `post`,
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => Router.push("/"),
  });

  const onBlur = () => {
    if (!!price) {
      const value = parseFloat(price);
      if (isNaN(value)) {
        setEnableSave(false);
        return;
      }
      setPrice(value.toFixed(2));
    }

    if (title.trim().length > 1 && !!price) {
      setEnableSave(true);
    } else {
      setEnableSave(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form className="form" onSubmit={submit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            onBlur={onBlur}
          />
        </div>
        <div className="form-group mb-3">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            className="form-control "
          />
        </div>
        <button
          disabled={!enableSave}
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
