import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  removeFromSocket,
  upsertFromSocket,
} from "../store/commentManager";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import SortBar from "../components/SortBar";
import Pagination from "../components/Pagination";

export default function CommentPage() {
  const { pageId } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { items, total, page, limit, sort, status, error } = useSelector(
    (s) => s.comments,
  );
  const socket = useMemo(() => {
    return io(import.meta.env.VITE_SERVER_ORIGIN, {
      autoConnect: false,
      auth: { token },
    });
  }, []);

  useEffect(() => {
    dispatch(fetchComments({ pageId, sort, page: 1, limit }));
  }, [dispatch, pageId]);

  useEffect(() => {
    if (!token) return;
    socket.auth = { token };
    socket.connect();
    return () => socket.disconnect();
  }, [token, socket]);

  useEffect(() => {
    socket.connect();

    socket.emit("page:join", pageId);

    const onCreated = (c) => dispatch(upsertFromSocket(c));
    const onUpdated = (c) => dispatch(upsertFromSocket(c));
    const onReaction = (c) => dispatch(upsertFromSocket(c));
    const onDeleted = (payload) => dispatch(removeFromSocket(payload));

    socket.on("comment:created", onCreated);
    socket.on("comment:updated", onUpdated);
    socket.on("comment:reaction", onReaction);
    socket.on("comment:deleted", onDeleted);

    return () => {
      socket.emit("page:leave", pageId);
      socket.off("comment:created", onCreated);
      socket.off("comment:updated", onUpdated);
      socket.off("comment:reaction", onReaction);
      socket.off("comment:deleted", onDeleted);
    };
  }, [dispatch, pageId, socket]);

  function onChangeSort(nextSort) {
    dispatch(fetchComments({ pageId, sort: nextSort, page: 1, limit }));
  }

  function onChangePage(nextPage) {
    dispatch(fetchComments({ pageId, sort, page: nextPage, limit }));
  }

  return (
    <div className="page">
      <h2>Comments for: {pageId}</h2>

      <CommentForm pageId={pageId} />

      <SortBar sort={sort} onChange={onChangeSort} />

      {status === "loading" ? <p className="muted">Loading…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <CommentList comments={items} />

      <Pagination
        total={total}
        page={page}
        limit={limit}
        onChange={onChangePage}
      />
    </div>
  );
}
