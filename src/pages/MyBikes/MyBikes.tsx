import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@/shared/ui/redesigned/Card';
import { Text } from '@/shared/ui/redesigned/Text';
import { Button } from '@/shared/ui/redesigned/Button';
import { Input } from '@/shared/ui/redesigned/Input';
import { VStack, HStack } from '@/shared/ui/redesigned/Stack';
import { Modal } from '@/shared/ui/redesigned/Modal';
import { $api } from '@/shared/api/api';

const BICYCLE_TYPES = [
    { value: 'road', label: 'Шосейний' },
    { value: 'mountain', label: 'Гірський' },
    { value: 'hybrid', label: 'Гібрид' },
    { value: 'bmx', label: 'BMX' },
    { value: 'electric', label: 'Електричний' },
    { value: 'folding', label: 'Складний' },
    { value: 'city', label: 'Міський' },
    { value: 'gravel', label: 'Гравел' },
];

interface Bicycle {
    id: string;
    name: string;
    type: string;
    brand?: string;
    model?: string;
    color?: string;
    year?: number;
    frame_size?: string;
    wheel_size?: number;
    description?: string;
    image_url?: string;
    is_active: boolean;
}

interface BicycleSelectorProps {
    selectedBicycleId?: string;
    onBicycleSelect: (bicycleId: string | null) => void;
    disabled?: boolean;
}

export const BicycleManagement = () => {
    const [bicycles, setBicycles] = useState<Bicycle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBicycle, setEditingBicycle] = useState<Bicycle | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'city',
        brand: '',
        model: '',
        color: '',
        year: new Date().getFullYear(),
        frame_size: '',
        wheel_size: 26,
        description: '',
        image_url: '',
    });

    useEffect(() => {
        fetchBicycles();
    }, []);

    const fetchBicycles = async () => {
        try {
            const response = await $api.get('/bicycles/my');
            setBicycles(response.data);
        } catch (error) {
            console.error('Помилка при завантаженні велосипедів:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingBicycle) {
                await $api.patch(`/bicycles/${editingBicycle.id}`, formData);
            } else {
                await $api.post('/bicycles', formData);
            }

            await fetchBicycles();
            handleCloseModal();
        } catch (error) {
            console.error('Помилка при збереженні велосипеда:', error);
        }
    };

    const handleEdit = (bicycle: Bicycle) => {
        setEditingBicycle(bicycle);
        setFormData({
            name: bicycle.name,
            type: bicycle.type,
            brand: bicycle.brand || '',
            model: bicycle.model || '',
            color: bicycle.color || '',
            year: bicycle.year || new Date().getFullYear(),
            frame_size: bicycle.frame_size || '',
            wheel_size: bicycle.wheel_size || 26,
            description: bicycle.description || '',
            image_url: bicycle.image_url || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Ви впевнені, що хочете видалити цей велосипед?')) return;

        try {
            await $api.delete(`/bicycles/${id}`);
            await fetchBicycles();
        } catch (error) {
            console.error('Помилка при видаленні велосипеда:', error);
        }
    };

    const handleSetActive = async (id: string) => {
        try {
            await $api.patch(`/bicycles/${id}/activate`);
            await fetchBicycles();
        } catch (error) {
            console.error('Помилка при активації велосипеда:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBicycle(null);
        setFormData({
            name: '',
            type: 'Місто',
            brand: '',
            model: '',
            color: '',
            year: new Date().getFullYear(),
            frame_size: '',
            wheel_size: 26,
            description: '',
            image_url: '',
        });
    };

    return (
        <VStack gap="16" max>
            <HStack justify="between" max>
                <Text title="Мої велосипеди" />
                <Button onClick={() => setIsModalOpen(true)}>
                    Додати велосипед
                </Button>
            </HStack>

            {bicycles.length === 0 ? (
                <Card padding="16">
                    <Text text="У вас поки немає велосипедів. Додайте свій перший велосипед!" />
                </Card>
            ) : (
                <VStack gap="8" max>
                    {bicycles.map((bicycle) => (
                        <Card key={bicycle.id} padding="16" className={bicycle.is_active ? 'border-green-500' : ''}>
                            <HStack justify="between" max>
                                <VStack gap="4">
                                    <HStack gap="8">
                                        <Text title={bicycle.name} />
                                        {bicycle.is_active && (
                                            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                                                Активний
                                            </span>
                                        )}
                                    </HStack>
                                    <Text text={`${BICYCLE_TYPES.find(t => t.value === bicycle.type)?.label || bicycle.type}`} />
                                    {bicycle.brand && bicycle.model && (
                                        <Text text={`${bicycle.brand} ${bicycle.model}`} />
                                    )}
                                    {bicycle.color && <Text text={`Колір: ${bicycle.color}`} />}
                                    {bicycle.year && <Text text={`Рік: ${bicycle.year}`} />}
                                </VStack>

                                <HStack gap="8">
                                    {!bicycle.is_active && (
                                        <Button onClick={() => handleSetActive(bicycle.id)}>
                                            Зробити активним
                                        </Button>
                                    )}
                                    <Button onClick={() => handleEdit(bicycle)}>
                                        Редагувати
                                    </Button>
                                    <Button onClick={() => handleDelete(bicycle.id)} variant="outline">
                                        Видалити
                                    </Button>
                                </HStack>
                            </HStack>
                        </Card>
                    ))}
                </VStack>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <VStack gap="16" max>
                    <Text title={editingBicycle ? 'Редагувати велосипед' : 'Додати велосипед'} />

                    <form onSubmit={handleSubmit}>
                        <VStack gap="12" max>
                            <VStack gap="4" max>
                                <Text text="Назва велосипеда" />
                                <Input
                                    value={formData.name}
                                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                                    placeholder="Наприклад: Мій Trek"
                                    required
                                />
                            </VStack>

                            <VStack gap="4" max>
                                <Text text="Тип велосипеда" />
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    {BICYCLE_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </VStack>

                            <HStack gap="8" max>
                                <VStack gap="4" max>
                                    <Text text="Бренд" />
                                    <Input
                                        value={formData.brand}
                                        onChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}
                                        placeholder="Trek, Giant, Specialized..."
                                    />
                                </VStack>

                                <VStack gap="4" max>
                                    <Text text="Модель" />
                                    <Input
                                        value={formData.model}
                                        onChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                                        placeholder="Domane, Escape, Rockhopper..."
                                    />
                                </VStack>
                            </HStack>

                            <HStack gap="8" max>
                                <VStack gap="4" max>
                                    <Text text="Колір" />
                                    <Input
                                        value={formData.color}
                                        onChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                                        placeholder="Червоний, синій..."
                                    />
                                </VStack>

                                <VStack gap="4" max>
                                    <Text text="Рік випуску" />
                                    <Input
                                        type="number"
                                        value={formData.year}
                                        onChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value, 10) || new Date().getFullYear() }))}
                                        min="1990"
                                        max={new Date().getFullYear() + 1}
                                    />
                                </VStack>
                            </HStack>

                            <HStack gap="8" max>
                                <VStack gap="4" max>
                                    <Text text="Розмір рами" />
                                    <Input
                                        value={formData.frame_size}
                                        onChange={(value) => setFormData(prev => ({ ...prev, frame_size: value }))}
                                        placeholder="S, M, L, XL або в см"
                                    />
                                </VStack>

                                <VStack gap="4" max>
                                    <Text text="Розмір коліс (дюйми)" />
                                    <Input
                                        type="number"
                                        value={formData.wheel_size}
                                        onChange={(value) => setFormData(prev => ({ ...prev, wheel_size: parseInt(value) || 26 }))}
                                        min="12"
                                        max="36"
                                    />
                                </VStack>
                            </HStack>

                            <VStack gap="4" max>
                                <Text text="Опис" />
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Додаткова інформація про велосипед..."
                                    className="w-full p-2 border rounded h-20"
                                />
                            </VStack>

                            <VStack gap="4" max>
                                <Text text="URL зображення" />
                                <Input
                                    value={formData.image_url}
                                    onChange={(value) => setFormData(prev => ({ ...prev, image_url: value }))}
                                    placeholder="https://example.com/bike-image.jpg"
                                    type="url"
                                />
                            </VStack>

                            <HStack gap="8" justify="end" max>
                                <Button type="button" onClick={handleCloseModal} variant="outline">
                                    Скасувати
                                </Button>
                                <Button type="submit">
                                    {editingBicycle ? 'Зберегти' : 'Додати'}
                                </Button>
                            </HStack>
                        </VStack>
                    </form>
                </VStack>
            </Modal>
        </VStack>
    );
};

export const BicycleSelector: React.FC<BicycleSelectorProps> = ({
                                                                    selectedBicycleId,
                                                                    onBicycleSelect,
                                                                    disabled = false,
                                                                }) => {
    const [bicycles, setBicycles] = useState<Bicycle[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBicycles = async () => {
        try {
            setLoading(true);
            const response = await $api.get('/bicycles/my');
            setBicycles(response.data);

            if (!selectedBicycleId && response.data.length > 0) {
                const activeBicycle = response.data.find((b: Bicycle) => b.is_active);
                if (activeBicycle) {
                    onBicycleSelect(activeBicycle.id);
                }
            }
        } catch (error) {
            console.error('Помилка при завантаженні велосипедів:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBicycles();
    }, []);

    if (loading) {
        return (
            <VStack gap="8" max>
                <Text text="Завантаження велосипедів..." />
            </VStack>
        );
    }

    if (bicycles.length === 0) {
        return (
            <VStack gap="8" max>
                <Text text="Оберіть велосипед для поїздки" />
                <Card padding="16">
                    <VStack gap="8" align="center">
                        <Text text="У вас поки немає велосипедів" />
                        <Text text="Додайте велосипед у своєму профілі, щоб приєднатися до поїздки" />
                    </VStack>
                </Card>
            </VStack>
        );
    }

    return (
        <VStack gap="8" max>
            <Text text="Оберіть велосипед для поїздки" />

            {/* Опція "Без велосипеда" */}
            <Card
                padding="12"
                className={`cursor-pointer transition-colors ${
                    selectedBicycleId === null
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && onBicycleSelect(null)}
            >
                <HStack gap="8" max>
                    <input
                        type="radio"
                        checked={selectedBicycleId === null}
                        onChange={() => !disabled && onBicycleSelect(null)}
                        disabled={disabled}
                    />
                    <VStack gap="2">
                        <Text title="Без велосипеда" />
                        <Text text="Планую орендувати або використати інший велосипед" />
                    </VStack>
                </HStack>
            </Card>

            {/* Список велосипедів користувача */}
            {bicycles.map((bicycle) => (
                <Card
                    key={bicycle.id}
                    padding="12"
                    className={`cursor-pointer transition-colors ${
                        selectedBicycleId === bicycle.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !disabled && onBicycleSelect(bicycle.id)}
                >
                    <HStack gap="8" max>
                        <input
                            type="radio"
                            checked={selectedBicycleId === bicycle.id}
                            onChange={() => !disabled && onBicycleSelect(bicycle.id)}
                            disabled={disabled}
                        />

                        {bicycle.image_url && (
                            <img
                                src={bicycle.image_url}
                                alt={bicycle.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                        )}

                        <VStack gap="4" max>
                            <HStack gap="8" max>
                                <Text title={bicycle.name} />
                                {bicycle.is_active && (
                                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                                        Активний
                                    </span>
                                )}
                            </HStack>

                            <Text text={BICYCLE_TYPES.find(t => t.value === bicycle.type)?.label || bicycle.type} />

                            {bicycle.brand && bicycle.model && (
                                <Text text={`${bicycle.brand} ${bicycle.model}`} />
                            )}

                            <HStack gap="16">
                                {bicycle.color && (
                                    <Text text={`Колір: ${bicycle.color}`} />
                                )}
                                {bicycle.year && (
                                    <Text text={`Рік: ${bicycle.year}`} />
                                )}
                                {bicycle.frame_size && (
                                    <Text text={`Розмір: ${bicycle.frame_size}`} />
                                )}
                            </HStack>

                            {bicycle.description && (
                                <Text text={bicycle.description} />
                            )}
                        </VStack>
                    </HStack>
                </Card>
            ))}
        </VStack>
    );
};

export default BicycleManagement;
