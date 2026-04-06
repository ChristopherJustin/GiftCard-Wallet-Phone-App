import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { createFolder } from "@/src/services/folderService";

export default function CreateFolderScreen() {
    const [name, setName] = useState("");
    const router = useRouter();

    const handleCreate = () => {
        if (!name.trim()) return;
        createFolder(name);
        router.back();
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Folder name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <Button title="Create Folder" onPress={handleCreate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
    },
});
