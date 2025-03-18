import React, { useState, useEffect } from "react";
import { View, Text, Modal, Button, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

interface RestTimerProps {
    isVisible: boolean;
    onClose: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ isVisible, onClose }) => {

    const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

    const getFormattedTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        return { mins, secs };
    };

    const [remainingTime, setRemainingTime] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isTimerRunning && remainingTime > 0) {
            interval = setInterval(() => {
                setRemainingTime(prevTime => Math.max(prevTime - 1, 0));
            }, 1000);
        } else if (remainingTime === 0) {
            setIsTimerRunning(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerRunning, remainingTime]);

    const { mins, secs } = getFormattedTime(remainingTime);

    // Functions to increase/decrease time
    const adjustMinutes = (amount: number) => {
        setRemainingTime(prev => Math.max(prev + amount * 60, 0));
    };

    const adjustSeconds = (amount: number) => {
        setRemainingTime(prev => {
            const newTime = prev + amount;
            return newTime >= 0 ? newTime : 0;
        });
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' }}>
                    
                    {/* Modal Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Text style={{ fontSize: 18 }}>Rest Timer</Text>
                        <Icon name="minus" size={15} color="black" onPress={onClose} />
                    </View>

                    {/* Time Adjustment Buttons */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        {/* Minutes Controls */}
                        <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                            <TouchableOpacity onPress={() => adjustMinutes(1)}>
                                <Icon name="chevron-up" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 36 }}>{formatNumber(mins)}</Text>
                            <TouchableOpacity onPress={() => adjustMinutes(-1)}>
                                <Icon name="chevron-down" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 36 }}>:</Text>

                        {/* Seconds Controls */}
                        <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                            <TouchableOpacity onPress={() => adjustSeconds(15)}>
                                <Icon name="chevron-up" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 36 }}>{formatNumber(secs)}</Text>
                            <TouchableOpacity onPress={() => adjustSeconds(-15)}>
                                <Icon name="chevron-down" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Timer Controls */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
                        <Button title={isTimerRunning ? 'Pause' : 'Start'} onPress={() => setIsTimerRunning(!isTimerRunning)} />
                        <Button title="Reset" onPress={() => { setIsTimerRunning(false); setRemainingTime(60); }} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default RestTimer;
