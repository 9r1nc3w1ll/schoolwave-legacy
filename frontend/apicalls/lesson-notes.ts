import { clientId } from "@/utility_methods/constants";

interface Note {
  id: string;
  topic: string;
  description: string;
  tag: string;
  content: string;
  class_id: string;
  created_by: string;
  last_updated_by: string;
  files: Buffer[];
  week: string[];
}

export const CreateLesssonNote = async (data: Note, access_token: any) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/lessonnotes/lesson-note-list", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
      "x-client-id": clientId!,

    },

    body: JSON.stringify(data),
  });
  const tempData = await res.json();

  return tempData;
};

export const getLesssonNote = async (access_token: any) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/lessonnotes/lesson-note-list", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
      "x-client-id": clientId!,

    }

  });
  const tempData = await res.json();

  return tempData.data;
};

export const editLessonNote = async (id: Note, access_token: any, data: Note) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/lessonnotes/lesson-note-detail/" + id, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
      "x-client-id": clientId!,
    },
    body: JSON.stringify(data),
  });
  const tempData = await res.json();

  return tempData;
};

export const deleteLessonNote = async (id: Note, access_token: any) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/lessonnotes/lesson-note-detail/" + id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
      "x-client-id": clientId!,

    },

  });

  return res;
};

export const getSingleLesson = async (id: Note, access_token: any) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/lessonnotes/lesson-note-detail/" + id, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
      "x-client-id": clientId!,
    }
  });
  const tempData = await res.json();

  return tempData.data;
};
