import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/handler";

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async ({ pageId, sort, page, limit }, thunkAPI) => {
    try {
      const { data } = await api.get("/api/comments", {
        params: { pageId, sort, page, limit },
      });
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/add",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/api/comments", payload);
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Add failed"
      );
    }
  }
);

export const editComment = createAsyncThunk(
  "comments/edit",
  async ({ id, content }, thunkAPI) => {
    try {
      const { data } = await api.put(`/api/comments/${id}`, { content });
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Edit failed"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.delete(`/api/comments/${id}`);
      return { id, data };
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Delete failed"
      );
    }
  }
);

export const likeComment = createAsyncThunk(
  "comments/like",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.post(`/api/comments/${id}/like`);
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Like failed"
      );
    }
  }
);

export const dislikeComment = createAsyncThunk(
  "comments/dislike",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.post(`/api/comments/${id}/dislike`);
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || "Dislike failed"
      );
    }
  }
);

const slice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    total: 0,
    totalComment: 0,
    page: 1,
    limit: 10,
    sort: "newest",
    status: "idle",
    error: null,
  },
  reducers: {
    upsertFromSocket(state, action) {
      const incoming = action.payload;
      const idx = state.items.findIndex((c) => c._id === incoming._id);
      if (idx >= 0) state.items[idx] = incoming;
      else state.items.unshift(incoming);
    },
    removeFromSocket(state, action) {
      const removeId = action.payload?.id ?? action.payload?._id;
      state.items = state.items.filter((c) => c._id !== removeId);
      state.total = Math.max(0, state.total - 1);
    },
    updateTotalCommentFromSocket(state, action) {
      const data = action.payload;
      state.totalComment = data.total;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchComments.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchComments.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload.items;
        s.total = a.payload.total;
        s.page = a.payload.page;
        s.limit = a.payload.limit;
        s.sort = a.payload.sort;
      })
      .addCase(fetchComments.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      .addCase(addComment.fulfilled, (s) => {
        s.total += 1;
      })
      .addCase(editComment.fulfilled, (s, a) => {
        const idx = s.items.findIndex((c) => c._id === a.payload._id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(deleteComment.fulfilled, (s, a) => {
        s.items = s.items.filter((c) => c._id !== a.payload._id);
        s.total = Math.max(0, s.total - 1);
      })
      .addCase(likeComment.fulfilled, (s, a) => {
        const idx = s.items.findIndex((c) => c._id === a.payload._id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(dislikeComment.fulfilled, (s, a) => {
        const idx = s.items.findIndex((c) => c._id === a.payload._id);
        if (idx >= 0) s.items[idx] = a.payload;
      });
  },
});

export const { upsertFromSocket, removeFromSocket, updateTotalCommentFromSocket } = slice.actions;
export default slice.reducer;
