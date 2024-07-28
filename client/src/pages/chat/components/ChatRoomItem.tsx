import { Link } from 'react-router-dom';

const ChatRoomItem = () => {
  return (
    <Link
      className="flex gap-2 p-3 cursor-pointer hover:bg-zinc-100"
      to={'/chat/1'}
    >
      {/* <div>
        <img
          className="w-12 h-12 rounded-full "
          src="https://pps.whatsapp.net/v/t61.24694-24/200301938_505519510885427_5383825801587828370_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AdSvWJpAwvhxVlZvLEt1jYsiGJVaYaWcD2ezCkXeRE1UlQ&oe=635E44AE"
          alt=""
        />
      </div> */}
      <div className="flex flex-col gap-1 items-start">
        <p>@luc_zonedddd</p>
        <p className="bg-primary-light px-1 rounded-sm text-xs">group</p>
        {/* <p className="text-sm text-zinc-500">Vai kemon achen???</p> */}
      </div>
    </Link>
  );
};

export default ChatRoomItem;
