import { User } from "./models/user.js";

export class UserRepository {
    async create(data) {
        return await User.create(data);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findByUsername(username) {
        return await User.findOne({ username });
    }

    async findById(id) {
        return await User.findById(id);
    }
}
