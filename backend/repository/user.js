import { User } from "./models/user.js";

export class UserRepository {
    async create(data) {
        return await User.create(data);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findByUsername(userName) {
        return await User.findOne({ userName });
    }

    async findById(id) {
        return await User.findById(id);
    }
}
