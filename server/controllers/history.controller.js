import userModel from "../models/user.model.js";
import historyModel from "../models/history.model.js";

export const get_history = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const user_id = user._id;

        const history = await historyModel.find({ user: user_id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "History fetched successfully",
            data: history
        });

    } catch (error) {
        console.log("Error in get_history controller:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while processing your request.",
            error: error.message
        });
    }
}

export const get_history_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const history_item = await historyModel.findById(id);

        if (!history_item) {
            return res.status(404).json({
                success: false,
                message: "History item not found"
            });
        }

        if (history_item.user.toString() !== user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "History item fetched successfully",
            data: history_item
        });

    } catch (error) {
        console.log("Error in get_history_by_id controller:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while processing your request.",
            error: error.message
        });
    }
}

export const delete_history_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const history_item = await historyModel.findById(id);

        if (!history_item) {
            return res.status(404).json({
                success: false,
                message: "History item not found"
            });
        }

        if (history_item.user.toString() !== user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await historyModel.deleteOne({ _id: id });

        return res.status(200).json({
            success: true,
            message: "History item deleted successfully"
        });

    } catch (error) {
        console.log("Error in delete_history_by_id controller:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while processing your request.",
            error: error.message
        });
    }
}