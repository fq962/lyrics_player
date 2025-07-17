import { supabase } from "./supabase";
import {
  NewSongData,
  Voice,
  TextAssignment,
  DbSong,
  DbVoice,
  DbVoiceSegment,
} from "@/types/song";

export class SongsService {
  /**
   * Guarda una canción completa con sus voces y segmentos
   */
  static async saveSong(
    songData: NewSongData,
    voices: Voice[],
    textAssignments: TextAssignment[]
  ): Promise<{ success: boolean; error?: string; songId?: number }> {
    try {
      // 1. Guardar la canción
      const { data: songResult, error: songError } = await supabase
        .from("songs")
        .insert({
          title: songData.title,
          lyrics: songData.lyrics,
        })
        .select()
        .single();

      if (songError) {
        console.error("Error al guardar canción:", songError);
        return { success: false, error: songError.message };
      }

      const songId = songResult.id;

      // 2. Guardar las voces
      const voicesData = voices.map((voice) => ({
        song_id: songId,
        name: voice.name,
        color: voice.color,
      }));

      const { data: voicesResult, error: voicesError } = await supabase
        .from("voices")
        .insert(voicesData)
        .select();

      if (voicesError) {
        console.error("Error al guardar voces:", voicesError);
        // Limpiar canción si falló
        await supabase.from("songs").delete().eq("id", songId);
        return { success: false, error: voicesError.message };
      }

      // 3. Crear mapeo de IDs locales a IDs de base de datos
      const voiceIdMap = new Map<string, number>();
      voices.forEach((voice, index) => {
        voiceIdMap.set(voice.id, voicesResult[index].id);
      });

      // 4. Guardar los segmentos de voz
      const segmentsData = textAssignments.map((assignment) => ({
        song_id: songId,
        voice_id: voiceIdMap.get(assignment.voiceId)!,
        start_pos: assignment.startIndex,
        end_pos: assignment.endIndex,
      }));

      if (segmentsData.length > 0) {
        const { error: segmentsError } = await supabase
          .from("voice_segments")
          .insert(segmentsData);

        if (segmentsError) {
          console.error("Error al guardar segmentos:", segmentsError);
          // Limpiar canción y voces si falló
          await supabase.from("songs").delete().eq("id", songId);
          return { success: false, error: segmentsError.message };
        }
      }

      return { success: true, songId };
    } catch (error) {
      console.error("Error general al guardar canción:", error);
      return {
        success: false,
        error: "Error inesperado al guardar la canción",
      };
    }
  }

  /**
   * Obtiene todas las canciones con sus voces y segmentos usando JOIN
   */
  static async getAllSongs(): Promise<{
    success: boolean;
    songs?: (DbSong & {
      voices: DbVoice[];
      voice_segments: DbVoiceSegment[];
    })[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select(
          `
          *,
          voices (
            id,
            name,
            color
          ),
          voice_segments (
            id,
            voice_id,
            start_pos,
            end_pos
          )
        `
        )
        .order("id", { ascending: false });

      if (error) {
        console.error("Error al obtener canciones:", error);
        return { success: false, error: error.message };
      }

      return { success: true, songs: data };
    } catch (error) {
      console.error("Error general al obtener canciones:", error);
      return {
        success: false,
        error: "Error inesperado al obtener las canciones",
      };
    }
  }

  /**
   * Obtiene una canción con sus voces y segmentos
   */
  static async getSongWithVoices(songId: number): Promise<{
    success: boolean;
    song?: DbSong;
    voices?: DbVoice[];
    segments?: DbVoiceSegment[];
    error?: string;
  }> {
    try {
      // Obtener canción
      const { data: song, error: songError } = await supabase
        .from("songs")
        .select("*")
        .eq("id", songId)
        .single();

      if (songError) {
        console.error("Error al obtener canción:", songError);
        return { success: false, error: songError.message };
      }

      // Obtener voces
      const { data: voices, error: voicesError } = await supabase
        .from("voices")
        .select("*")
        .eq("song_id", songId);

      if (voicesError) {
        console.error("Error al obtener voces:", voicesError);
        return { success: false, error: voicesError.message };
      }

      // Obtener segmentos
      const { data: segments, error: segmentsError } = await supabase
        .from("voice_segments")
        .select("*")
        .eq("song_id", songId);

      if (segmentsError) {
        console.error("Error al obtener segmentos:", segmentsError);
        return { success: false, error: segmentsError.message };
      }

      return { success: true, song, voices, segments };
    } catch (error) {
      console.error("Error general al obtener canción completa:", error);
      return {
        success: false,
        error: "Error inesperado al obtener la canción",
      };
    }
  }

  /**
   * Elimina una canción y todos sus datos relacionados
   */
  static async deleteSong(
    songId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("songs").delete().eq("id", songId);

      if (error) {
        console.error("Error al eliminar canción:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error general al eliminar canción:", error);
      return {
        success: false,
        error: "Error inesperado al eliminar la canción",
      };
    }
  }
}
