import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Folder } from "../types/Folder";

type Props = {
    folders: Folder[];
    onPressFolder: (folder: Folder) => void;
    onDeleteFolder: (id: string) => void;
};

export default function FolderList({
    folders,
    onPressFolder,
    onDeleteFolder,
}: Props) {
    return (
        <SwipeListView
            data={folders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
                <Pressable
                    style={styles.card}
                    onPress={() => onPressFolder(item)}
                >
                    <Text style={styles.name}>{item.name}</Text>
                </Pressable>
            )}
            renderHiddenItem={({ item }) => (
                <Pressable
                    style={styles.delete}
                    onPress={() => onDeleteFolder(item.id)}
                >
                    <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
            )}
            rightOpenValue={-80}
            ListEmptyComponent={
                <Text style={styles.empty}>No folders yet</Text>
            }
        />
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
    },

    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },

    name: { fontSize: 16, fontWeight: "600" },

    delete: {
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: 20,
        backgroundColor: "#ef4444",
        borderRadius: 12,
        marginVertical: 6,
    },

    deleteText: { color: "#fff", fontWeight: "600" },

    empty: {
        textAlign: "center",
        marginTop: 40,
        color: "#6b7280",
    },
});
