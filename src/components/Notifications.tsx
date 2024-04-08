interface IProps {
  notifications: string[];
}

export const Notifications = ({ notifications }: IProps) => {
  return (
    <pre>{JSON.stringify(notifications, null, 2)}</pre>
  )
}