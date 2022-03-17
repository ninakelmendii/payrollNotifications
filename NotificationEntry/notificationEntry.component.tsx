import {getNotificationDescription, getNotificationTitle, Notification} from '../../types/notification.type';
import styles from './NotificationEntry.module.scss';
import {NotificationEntryIcon} from '../../assets/icons/icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {readSelectedNotification} from '../../pages/NotificationsPage/actions';
import classNames from 'classnames';

interface Props {
  notification: Notification
}

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export const NotificationEntry: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const changeStatusToRead = useCallback((notificationId: string) => dispatch(readSelectedNotification(notificationId)), [dispatch]);

  return <div
      onClick={() => {
        if (!props.notification.readAt) {
          changeStatusToRead(props.notification.id);
        }
      }}
      className={classNames({
        [styles.notificationEntryContainer]: true,
        [styles.unreadNotification]: !props.notification.readAt,
      })}
  >
    <div className={styles.genderAvatar}>
      <NotificationEntryIcon/>
    </div>
    <div className={styles.notificationContent} style={{ width: '80%' }}>
      <div>
        <span>{getNotificationTitle(props.notification.type)}</span>:
        "{props.notification.name}{getNotificationDescription(props.notification)}"
      </div>
      <div className={styles.notificationTime}>
        {timeAgo.format(new Date(props.notification.createdAt), 'round')}
      </div>
    </div>
    <div className={styles.unreadContainer}>
      {!props.notification.readAt && <span className={styles.unreadDot}/>}
    </div>
  </div>;
};
