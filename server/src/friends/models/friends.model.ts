import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';


interface FriendAttributes {
    userId: number;
    friendId: number;
    status: 'pending' | 'accepted' | 'rejected';
}
  
interface FriendCreationAttributes extends FriendAttributes {}


@Table({ tableName: 'friends' })
export class Friends extends Model<FriendAttributes, FriendCreationAttributes> {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => User)
    @Column
    friendId: number;

    @Column({ type: DataType.STRING, defaultValue: 'pending' })
    status: string;

    @BelongsTo(() => User, 'userId')
    user: User;

    @BelongsTo(() => User, 'friendId')
    friend: User;
}