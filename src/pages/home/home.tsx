import { useState, useEffect } from 'react'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import withLayout from '../../hocs/withLayout';
import useFetch from '../../hooks/useFetch';

interface Booking {
  id: string
  roomName: string
  hostName: string
  guests: Array<string>
  bookingDate: string
  bookingTimeStart: string
  duration: number
}

type TPageNumberDisplay = {
  start: number
  current: number
  end: number
}

const Home = () => {
  const [originalBookings, setOriginalBookings] = useState<Booking[]>([]);
  const [bookings, setBookings] = useState<Booking[]>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsCount, setRowsCount] = useState<number>(10);
  const fetchHandler = useFetch();

  // pagination stuff -- this should be handled by back-end
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const delta = 2;

  const pageNumberDisplay = ({ start, current, end }: TPageNumberDisplay) => {
    const isAtEnd = totalPages - delta >= currentPage;

    if (isAtEnd) {
      if (currentPage <= delta) {
        return start;
      }

      return current
    }

    return end;
  }

  // For handling page changes
  const onPageChange = (newCurrentPage: number) => () => {
    setCurrentPage(newCurrentPage);
  }

  // For updating the total rows
  const onChangeTotalRows: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const selectedRowsCount = Number(e.target.value);
    let newTotalPages = Math.floor(originalBookings.length / selectedRowsCount);

    if (newTotalPages <= 3) {
      newTotalPages = 3;
    }

    setTotalPages(newTotalPages);
    setRowsCount(selectedRowsCount);
  }

  // Initialize the data
  useEffect(() => {
    fetchHandler('bookings', { method: 'GET' }).then(response => {

      // this should be initialized from the BE
      let initialTotalPages = response.length / rowsCount;

      if (initialTotalPages <= 3) {
        initialTotalPages = 3;
      }

      setTotalPages(initialTotalPages); 
      setOriginalBookings(response);
      setBookings(response.slice(0, rowsCount));
    });
  }, []);

  // Update the data on page change and row count change
  useEffect(() => {
    // so... we're doing all of this in front-end? hehe
    const start = currentPage === 1 ? 0 : (currentPage - 1) * rowsCount
    const end = start + rowsCount;

    // dunno what's the edge cases for this one
    // this is not very simple in front-end btw...
    const newBookings = originalBookings.slice(start, end);

    setBookings(newBookings);
  }, [currentPage, rowsCount]);

  return (
    <div className={cn("container", "home")}>
      <div className="pagination">
        <div className="pagination__rows-count">
          <p className="pagination__text">show</p>
          <select 
            className="pagination__select" 
            onChange={onChangeTotalRows} 
            value={rowsCount}
          >
            <option className="pagination__option" value={10}>10</option>
            <option className="pagination__option" value={15}>15</option>
            <option className="pagination__option" value={20}>20</option>
            <option className="pagination__option" value={25}>25</option>
          </select>
          <p className="pagination__text">rows</p>
        </div>
        <div className="pagination__pager">
          <button 
            className="pagination__pager-prev" 
            disabled={!hasPrev} 
            onClick={onPageChange(currentPage - 1)}
          >
            Previous
          </button>
          <div className="pagination__pages-num">
            <button 
              className={cn("pagination__num", { active: !hasPrev })}
              onClick={onPageChange(currentPage - 1)}
            >
              {pageNumberDisplay({
                start: 1,
                current: currentPage - 1,
                end: totalPages - delta
              })}
            </button>
            <button 
              className={cn("pagination__num", { active: hasPrev && hasNext })}
              onClick={
                !hasNext 
                ? onPageChange(currentPage - 1) 
                : !hasPrev 
                ? onPageChange(currentPage + 1) 
                : undefined
              }
            >
              {pageNumberDisplay({
                start: 2,
                current: currentPage,
                end: totalPages - 1
              })}
            </button>
            <button 
              className={cn("pagination__num", { active: !hasNext })}
              onClick={onPageChange(currentPage + 1)}
            >
              {pageNumberDisplay({
                start: 3,
                current: currentPage + 1,
                end: totalPages
              })}
            </button>
          </div>
          <button 
            className="pagination__pager-next" 
            disabled={!hasNext}
            onClick={onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <ul className="rooms">
        {bookings && bookings.map(booking => (
          <li className="rooms__item" key={booking.id}>
            <Link className="rooms__link" to={`/rooms/${booking.id}`}>
              <div className="room">
                <p className="room__name">{booking.roomName} #{booking.id}</p>
                <p className="room__hostname">{booking.hostName}</p>
                <p className="room__booking-date">
                  {new Date(booking.bookingDate).toDateString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withLayout(Home);
