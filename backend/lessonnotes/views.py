from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import LessonNote
from .serializers import LessonNoteSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ListCreateLessonNote(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = LessonNote.objects.all()
    serializer_class = LessonNoteSerializer

    def get_queryset(self):
        qs = self.queryset.all()

        lessonnote_id = self.kwargs.get("lesson_notes_id", "") 
        if lessonnote_id:
            qs = qs.filter(id=lessonnote_id)
        
        if "teacher_id" in self.request.GET:
            teacher_id = self.request.GET["teacher_id"]

            qs = qs.filter(created_by__id=teacher_id)
        
        if "week" in self.request.GET:
            week = self.request.GET["week"]

            qs = qs.filter(week=week)
        
        if "subject_id" in self.request.GET:
            subject_id = self.request.GET["subject_id"]

            qs = qs.filter(subject_id=subject_id)

        return qs
        

    def create(self, request, *args, **kwargs):


        serializer = LessonNoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            message = "Lesson Note created successfully."
            
            headers = self.get_success_headers(serializer.data)

            resp = {
                    "message": message,
                    "data": serializer.data,
                }
            return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

        else:
            resp = {
                "message": "Invalid data.",
                "errors": serializer.errors,
            }
            return Response(resp, status=status.HTTP_400_BAD_REQUEST)
   
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "message": "Lesson Note fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)
    

class RetrieveUpdateDestoryLessonNote(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = LessonNote.objects.all()
    serializer_class = LessonNoteSerializer

    def get_object(self):
        lessonnote_id = self.kwargs.get("pk")
        try:
            lessonnote = LessonNote.objects.get(id=lessonnote_id)
        except LessonNote.DoesNotExist:
            return Response({"message": "Lesson Note not found."}, status=status.HTTP_404_NOT_FOUND)
        return lessonnote

    def retrieve(self, request, *args, **kwargs):
        lessonnote = self.get_object()
        serializer = LessonNoteSerializer(lessonnote)
        resp = {
            "message": "Lesson Note retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        lessonnote = self.get_object()

        serializer = LessonNoteSerializer(lessonnote, data=data, partial=True)
        if serializer.is_valid(): 
            lessonnote = serializer.save() 
            data = LessonNoteSerializer(lessonnote).data    
        
            return Response({
                "message": "Lesson Note updated successfully.",
                "data": data
            })
        
        return Response({
            "message": "Lesson Note not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        lessonnote = self.get_object()
        if lessonnote:
            lessonnote.delete()
            resp = {
                "message": "Lesson Note deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Lesson Note not found."}, status=status.HTTP_404_NOT_FOUND)