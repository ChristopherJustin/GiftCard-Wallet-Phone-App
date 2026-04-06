import React, { useCallback, useState } from "react";
import {
    View,
    StyleSheet,
    Modal,
    Text,
    TextInput,
    Pressable,
} from "react-native";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FolderList from "@/src/components/FolderList";
import {
    getAllFolders,
    createFolder,
    deleteFolder,
    FolderRecord,
} from "@/src/services/folderService";

export default function FoldersScreen() {
    const router = useRouter();
    const [folders, setFolders] = useState<FolderRecord[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");

    const loadFolders = () => setFolders(getAllFolders());

    useFocusEffect(
        useCallback(() => {
            loadFolders();
        }, [])
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Folders",
                    headerRight: () => (
                        <Pressable
                            onPress={() => router.push("/profile")}
                            style={{ paddingRight: 12 }}
                        >
                            <Text style={{ fontSize: 22 }}>👤</Text>
                        </Pressable>
                    ),
                }}
            />

            <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
                <FolderList
                    folders={folders}
                    onPressFolder={(f) => router.push(`/folders/${f.id}`)}
                    onDeleteFolder={deleteFolder}
                />

                <Pressable
                    style={styles.fab}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.fabText}>＋</Text>
                </Pressable>

                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalCard}>
                            <Text style={styles.title}>New Folder</Text>

                            <TextInput
                                placeholder="Folder name"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                                autoFocus
                            />

                            <View style={styles.actions}>
                                <Pressable
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancel}>Cancel</Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => {
                                        if (!name.trim()) return;
                                        createFolder(name.trim());
                                        setName("");
                                        setModalVisible(false);
                                        loadFolders();
                                    }}
                                >
                                    <Text style={styles.create}>Create</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#111827",
        alignItems: "center",
        justifyContent: "center",
    },
    fabText: { color: "#fff", fontSize: 28 },

    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        alignItems: "center",
        justifyContent: "center",
    },
    modalCard: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 14,
    },
    title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        padding: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    cancel: { color: "#6b7280" },
    create: { color: "#111827", fontWeight: "600" },
});