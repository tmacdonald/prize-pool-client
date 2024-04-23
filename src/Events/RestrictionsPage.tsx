import { useParams } from "react-router";
import { Restrictions } from "./Restrictions";

export const RestrictionsPage = () => {
  const { eventId } = useParams();

  return <Restrictions eventId={eventId!} />;
};
