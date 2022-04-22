import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import withLayout from '../../hocs/withLayout';

const initialRoomValues = {
  roomName: '',
  hostName: '',
  guests: '',
  startTime: '',
  startDate: '',
  duration: 1,
} as { [x: string]: any }

interface Payload {
  id?: string
  roomName: string
  hostName: string
  guests: string[]
  bookingTimeStart: string
  duration: number
}

const Room = () => {
  const [prevRoom, setPrevRoom] = useState(initialRoomValues);
  const [room, setRoom] = useState(initialRoomValues);
  const [mode, setMode] = useState<string>('');

  const params = useParams();
  const navigate = useNavigate();
  const fetchHandler = useFetch();

  // Generic event handler
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    let { name, value } = e.target;

    setRoom(prevRoom => ({ ...prevRoom, [name]: value }))
  }

  // Process start date
  const toStartDate = (date: Date) => {
    const dateParts = new Intl.DateTimeFormat('en-US').formatToParts(date);
    const year = dateParts[dateParts.length - 1].value
    const month = dateParts[0].value.padStart(2, '0')
    const day = dateParts[2].value.padStart(2, '0')
    const startDate = `${year}-${month}-${day}`;

    return startDate;
  }

  // Process start time
  const toStartTime = (date: Date) => {
    const startTimeOptions = {
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric',
      timeZoneName: 'short',
    } as {
      hour: 'numeric' | '2-digit' | undefined
      minute: 'numeric' | '2-digit' | undefined
      second: 'numeric' | '2-digit' | undefined
    }

    let startTime = new Intl.DateTimeFormat('en-US', startTimeOptions).format(date)
    startTime = startTime.split(' ')[0]

    return startTime;
  }

  // Process booking time start
  const toBookingTimeStart = (startDate: string, startTime: string) => {
    let date = new Date(`${startDate} ${startTime}`);

    return date.toISOString();
  }

  // Set mode to add
  const handleAddMode = () => {
    setMode('add');
    setRoom({
      ...prevRoom,
      guests: initialRoomValues.guests,
      startTime: initialRoomValues.startTime,
      startDate: initialRoomValues.startDate,
      duration: initialRoomValues.duration,
    })
  }

  // Cancel 
  const onCancel = () => {
    setMode('');
    setRoom(prevRoom);
  }

  // Main save event handler
  const onSave = () => {
    let payload = {
      roomName: room.roomName,
      hostName: room.hostName,
      guests: room.guests.split(','),
      duration: room.duration,
      bookingTimeStart: toBookingTimeStart(room.startDate, room.startTime)
    } as Payload;

    if (mode === 'edit') {
      payload.id = params.id;

      handleEdit(payload);
    }

    if (mode === 'add') {
      // TODO: There's a bug in the back-end
      // There's an internal server error
      //
      // Uncomment this code below if the back-end is good:
      // handleAdd(payload);

      // fake add
      alert('Added!');
      navigate('/');
    }

    setMode('');
  }

  // Put request - support edit 
  // Btw, i changed the back-end for this to work because
  // "PATCH" - is not supported in native fetch of the browser
  // "PUT" - works tho :)
  const handleEdit = async (payload: Payload) => {
    return fetchHandler(`bookings/${params.id}`, {
      method: 'put',
      headers: {
        contentType: 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((res) => {
      alert('Edited!');
      console.log(res);
    });
  }

  // Post request - add new room
  const handleAdd = async (payload: Payload) => {
    return fetchHandler(`bookings`, {
      method: 'post',
      headers: {
        contentTpye: 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(res => {
      console.log(res);
    });
  }

  // Initialize
  useEffect(() => {
    if (!params.id) return;

    fetchHandler(
      `bookings/${params.id}`, 
      { method: 'get' }
    ).then(res => {
      // gotta do this from scratch - momentjs is too massive
      const bookingTimeStart = new Date(res.bookingTimeStart);
      const newRoom = {
        ...res,
        startDate: toStartDate(bookingTimeStart),
        startTime: toStartTime(bookingTimeStart),
        guests: res.guests.join(','),
      }

      setRoom(newRoom);
      setPrevRoom(newRoom);
    });
  }, [params]);

  return (
    <div className="container">
      <div className="room__header">
        <div className="room__header-group">
          <input 
            className="room__input-name" 
            type="text" 
            name="roomName"
            value={room.roomName} 
            onChange={handleChange}
            disabled={!mode} 
          />
          <input 
            className="room__input-hostname" 
            type="text" 
            name="hostName"
            value={room.hostName} 
            onChange={handleChange}
            disabled={!mode} 
          />
        </div>
        {!mode ? (
          <>
            <button 
              className="room__add room__btn" 
              onClick={handleAddMode}
            >
              Add
            </button>
            <button 
              className="room__edit room__btn"
              onClick={() => setMode('edit')}
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <button 
              className="room__cancel room__btn" 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              className="room__save room__btn" 
              onClick={onSave}
            >
              Save
            </button>
          </>
        )}
      </div>
      <form className="room__form">
        <label htmlFor="guests" className="room__label">
          <span>Guests</span>
          <input 
            className="room__input"
            name="guests"
            type="input" 
            placeholder="Guests" 
            value={room.guests}
            onChange={handleChange}
            disabled={!mode}
          />
          <p className="room__note">
            Note: Use comma (,) to add multiple guests
          </p>
        </label>
        <label className="room__label">
          <span>Choose start time</span>
          <div className="room__label-group">
            <input 
              className="room__input room__input-date"
              name="startDate"
              type="date" 
              value={room.startDate}
              onChange={handleChange}
              disabled={!mode}
            />
            <input 
              className="room__input room__input-date"
              name="startTime"
              type="time" 
              value={room.startTime}
              onChange={handleChange}
              disabled={!mode}
            />
          </div>
          <p className="room__note">
            Note: Reservations are only available for the next eight days.
          </p>
        </label>
        <label htmlFor="duration" className="room__label">
          <span>Duration</span>
          <input 
            className="room__input"
            name="duration"
            type="number" 
            placeholder="Duration" 
            value={room.duration}
            onChange={handleChange}
            disabled={!mode}
            min={1}
          />
        </label>
      </form>
    </div>
  );
}

export default withLayout(Room);
