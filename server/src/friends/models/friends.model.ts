import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';


interface FriendAttributes {
    userId: number;
    friendId: number;
    status: 'pending' | 'accepted' | 'rejected';
}

@Table({ tableName: 'friends' })
export class Friends extends Model<FriendAttributes, Friends> {
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    friendId: number;

    @Column({ type: DataType.STRING, defaultValue: 'pending' })
    status: string;

    @BelongsTo(() => User, { foreignKey: 'userId', as: 'User' })
    user: User;

    @BelongsTo(() => User, { foreignKey: 'friendId', as: 'Friend' })
    friend: User;
}