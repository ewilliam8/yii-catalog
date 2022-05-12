<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "uprofiles".
 *
 * @property int $id
 * @property int $user_id
 * @property int $profile_id
 * @property int $direction_id
 * @property int $priority
 * @property string|null $createdAt
 * @property string|null $updatedAt
 */
class Uprofiles extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'uprofiles';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['user_id', 'profile_id', 'direction_id', 'priority'], 'required'],
            [['user_id', 'profile_id', 'direction_id', 'priority'], 'integer'],
            [['createdAt', 'updatedAt'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'profile_id' => 'Profile ID',
            'direction_id' => 'Direction ID',
            'priority' => 'Priority',
            'createdAt' => 'Created At',
            'updatedAt' => 'Updated At',
        ];
    }
}
