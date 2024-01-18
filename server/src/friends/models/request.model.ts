import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';



@Table({ tableName: 'requestForFriendship' })
export class requestForFriendship extends Model<requestForFriendship> {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => User)
    @Column
    friendId: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isAccepted: boolean;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => User, 'friendId')
    friend: User;
}