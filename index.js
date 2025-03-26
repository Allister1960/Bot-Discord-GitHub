const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
require('dotenv').config();

// ===================== 🌸 KONSTANTA UTAMA =====================
const BOT_INFO = {
  NAME: 'Heizou The Helper',
  VERSION: '🌸 Sakura Edition v1.1.4',
};

const CONFIG = {
  CHANNELS: {
    STATUS: '1352852214523367526',
    TIKTOK: '1337354684737781812',
    GIVEAWAY: '1328706479360053371',
    SUGGESTIONS: '1345065170933911653',
    TRANSACTIONS: '1328716883884769374'
  },
  
  USERS: {
    ATUN: '1311148461709725761',
    MAHESA: '1262567474889490524',
    RENREN: '1005415465130139700'
  },
  
  ROLES: {
    STAFF: '1328286509752647702',
    TRADER: '1328361695105519710'
  },
  
  LINKS: {
    SOCIABUZZ: {
      ATUN: 'https://sociabuzz.com/atun',
      RENREN: 'https://sociabuzz.com/allister1960'
    },
    TIKTOK_RENREN: 'https://www.tiktok.com/@ayniman4',
    TIKTOK_SUKINANEKO: 'https://www.tiktok.com/@sukinaneko',
    GITHUB: 'https://github.com/Allister1960/Bot-Discord',
    SUPPORT: 'https://discord.gg/your-invite'
  },
  
  DESIGN: {
    COLORS: {
      PRIMARY: '#FF9F9F',
      SECONDARY: '#A8E6CF',
      ERROR: '#FF6961',
      INFO: '#BAE1FF'
    },
    IMAGES: {
      BANNER: './images/heizou_banner.png',
      ICON: './images/heizou_icon.png',
      TIKTOK_ICON: './images/tiktok_icon.png',
      ERROR_ICON: './images/error_icon.png',
      GIFT_ICON: './images/gift_icon.png'
    },
    EMOJI: {
      ADMIN: '🌸',
      LINK: '🔗',
      BUG: '🐞'
    }
  },

  MESSAGES: {
    WELCOME: `${BOT_INFO.NAME} siap membantu!`,
    HELP: [
      '🌸 !admin - Info admin server',
      '📮 !sociabuzz - Link donasi admin',
      '🔗 !invitelink - Buat invite link',
      '🎥 !tiktok - Info TikTok admin',
      '🐞 !bug - Lapor bug/error',
      '💤 !afk - Set status AFK',
      '🎉 !giveaway - Memulai Giveaway (Staff) | (⚠️Experimental)',
      '📝 !check - Check durasi nyala Bot (Detik)',
      '⚠️ !shutdown - Matikan bot (Owner)',
      '🤖 !vbot - Info tentang bot',
      '📌 !status - Update status (Staff)'
    ]
  },
  
  BOT: BOT_INFO
};

// ===================== 🛠️ SISTEM DATA =====================
let afkUsers = {};
let adminStatus = {
  [CONFIG.USERS.RENREN]: { status: '🟡 Ngoding', role: 'Admin & Owner Server' },
  [CONFIG.USERS.ATUN]: { status: '⚫ Belum Setting', role: 'Admin Blox Fruit' },
  [CONFIG.USERS.MAHESA]: { status: '🔴 HP rusak', role: 'Admin TikTok' }
};

// ===================== 🎀 INISIALISASI CLIENT =====================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ===================== 🛠️ FUNGSI UTILITY =====================
const createHeizouEmbed = (title, description, color = CONFIG.DESIGN.COLORS.PRIMARY) => {
  const divider = '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯▬▬▬▬▬▬';
  return new EmbedBuilder()
    .setTitle(`${CONFIG.DESIGN.EMOJI.ADMIN} ${title}`)
    .setDescription(`${divider}\n${description}\n${divider}`)
    .setColor(color)
    .setFooter({ 
      text: `${CONFIG.BOT.NAME} • ${CONFIG.BOT.VERSION}`,
      iconURL: 'attachment://heizou_icon.png'
    })
    .setTimestamp();
};

// ===================== ⚙️ EVENT HANDLERS =====================
client.once('ready', async () => {
  console.log(`${CONFIG.BOT.NAME} Aktif!\nCredit: Suki na Neko's Team\nMain Developer: Renren`);
  
  try {
    const iconAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);
    const bannerAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.BANNER);
    const iconGifAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);

    const channel = client.channels.cache.get(CONFIG.CHANNELS.STATUS);
    if (channel) {
      await channel.send({
        embeds: [createHeizouEmbed(
          'Bot Aktif!',
          CONFIG.MESSAGES.WELCOME,
          CONFIG.DESIGN.COLORS.SECONDARY
        )
        .setThumbnail('attachment://heizou_icon.png')
        .setImage('attachment://heizou_banner.png')],
        files: [iconAttachment, bannerAttachment]
      });
    }
  } catch (error) {
    console.error('Gagal mengirim pesan status:', error);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Handler AFK Return
  if (afkUsers[message.author.id]) {
    const data = afkUsers[message.author.id];
    const duration = Math.floor((Date.now() - data.timestamp) / 1000);
    
    delete afkUsers[message.author.id];
    
    try {
      await message.member.setNickname(
        message.member.displayName.replace('[AFK] ', '')
      );
    } catch (error) {
      console.error('Gagal reset nickname:', error);
    }

    message.reply({
      embeds: [createHeizouEmbed(
        'Selamat Kembali! 🎉',
        `Durasi AFK: **${duration} detik**\nAlasan: \`${data.reason}\``,
        CONFIG.DESIGN.COLORS.SECONDARY
      )]
    });
  }

  const args = message.content.split(/ +/);
  const command = args.shift().toLowerCase();

  try {
    switch(command) {
      case '!help': { // <-- Block scope
        const iconAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);
        message.reply({
          files: [iconAttachment],
          embeds: [
            createHeizouEmbed(
              'Menu Bantuan Lengkap',
              CONFIG.MESSAGES.HELP.join('\n'),
              CONFIG.DESIGN.COLORS.SECONDARY
            ).setThumbnail('attachment://heizou_icon.png')
          ]
        });
        break;
      } // <-- Akhir scope

      case '!shutdown': {
        if (message.author.id !== CONFIG.USERS.RENREN) {
          return message.reply({
            embeds: [createHeizouEmbed(
              '🚫 Akses Ditolak!',
              'Hanya owner yang bisa menggunakan command ini!',
              CONFIG.DESIGN.COLORS.ERROR
            )]
          });
        }
      
        try {
          // 1. Buat embed status shutdown
          const shutdownEmbed = createHeizouEmbed(
            '🔌 SHUTDOWN SEQUENCE INITIATED',
            'Bot akan mati dalam **3 detik**...\n\n' +
            '▫️ Status: `Memutus koneksi...`\n' +
            '▫️ Aktivitas: `Membersihkan cache...`\n' +
            `${CONFIG.DESIGN.EMOJI.BUG} **Developer**: <@${CONFIG.USERS.RENREN}>`,
            CONFIG.DESIGN.COLORS.ERROR
          )
          .setThumbnail('attachment://heizou_icon.png');
      
          // 2. Kirim notifikasi ke channel status
          const statusChannel = client.channels.cache.get(CONFIG.CHANNELS.STATUS);
          if (statusChannel) {
            await statusChannel.send({
              embeds: [createHeizouEmbed(
                '⚠️ BOT SHUTDOWN',
                `${CONFIG.BOT.NAME} akan non-aktif!\n` +
                `**Dimatikan oleh**: <@${message.author.id}>`,
                CONFIG.DESIGN.COLORS.ERROR
              )]
            });
          }
      
          // 3. Kirim embed ke user
          await message.reply({ embeds: [shutdownEmbed] });
      
          // 4. Proses shutdown dengan delay
          setTimeout(async () => {
            try {
              // Update status bot
              await client.user.setPresence({ 
                status: 'inactive',
                activities: [{ 
                  name: '🔌 Shutting Down...', 
                  type: 4 // ActivityType.Custom
                }] 
              });
      
              // Destroy client dan exit
              await client.destroy();
              console.log(`🛑 ${CONFIG.BOT.NAME} dimatikan oleh ${message.author.tag}`);
              process.exit(0);
            } catch (error) {
              console.error('Gagal mematikan bot:', error);
              process.exit(1);
            }
          }, 3000);
      
        } catch (error) {
          console.error('Error dalam proses shutdown:', error);
          message.reply({
            embeds: [createHeizouEmbed(
              '⚠️ Gagal Mematikan!',
              'Terjadi kesalahan internal saat mematikan bot',
              CONFIG.DESIGN.COLORS.ERROR
            )]
          });
        }
        break;
      }

      case '!check': {
        return message.reply({
          embeds: [createHeizouEmbed(
            `Aplikasi telah berjalan selama: ${process.uptime()} detik`,
            CONFIG.DESIGN.COLORS.ERROR
          )]
        });
      }

  case '!invitelink': {
    try {
      if (!message.channel.permissionsFor(message.guild.members.me).has('CREATE_INSTANT_INVITE')) {
        return message.reply({
          embeds: [createHeizouEmbed(
            'Izin Dibutuhkan!',
            'Bot tidak memiliki izin membuat invite link di channel ini',
            CONFIG.DESIGN.COLORS.ERROR
          )]
        });
      }
  
      const invite = await message.channel.createInvite({
        maxAge: 86400, // 24 jam
        maxUses: 1,
        temporary: true
      });
  
      message.reply({
        embeds: [createHeizouEmbed(
          '🔗 Link Undangan 24 Jam',
          `**Link undangan sekali pakai:**\n${invite.url}\n\n` +
          'Salin teks di bawah ini:\n' +
          `\`${invite.url}\``, // Format untuk mudah copy
          CONFIG.DESIGN.COLORS.SECONDARY
        ).addFields(
          { name: '🕒 Masa Berlaku', value: '24 Jam', inline: true },
          { name: '🚫 Max Penggunaan', value: '1 Kali', inline: true }
        )]
      });
    } catch (error) {
      console.error('Gagal membuat invite:', error);
      message.reply({
        embeds: [createHeizouEmbed(
          'Terjadi Kesalahan!',
          'Gagal membuat link undangan',
          CONFIG.DESIGN.COLORS.ERROR
        )]
      });
    }
    break;
  }

        case '!afk':
  const reason = args.join(' ') || 'Sedang AFK';
  const originalNickname = message.member.nickname || message.author.username;

  // Simpan data AFK
  afkUsers[message.author.id] = {
    timestamp: Date.now(),
    reason: reason,
    originalNickname: originalNickname
  };

  try {
    // Update nickname
    await message.member.setNickname(`[AFK] ${originalNickname}`);
  } catch (error) {
    console.error('Gagal mengubah nickname:', error);
    return message.reply({
      embeds: [createHeizouEmbed(
        'Gagal Set AFK!',
        'Bot tidak memiliki izin mengubah nickname',
        CONFIG.DESIGN.COLORS.ERROR
      )]
    });
  }

  message.reply({
    embeds: [createHeizouEmbed(
      'Status AFK Diaktifkan! 💤',
      `Alasan: \`${reason}\`\n` +
      'Ketik pesan apa pun untuk menonaktifkan AFK',
      CONFIG.DESIGN.COLORS.SECONDARY
    )]
  });
  break;

// Tambahkan handler mention AFK (di luar switch(command), sebelum command handler
// Letakkan di bawah handler AFK return
// 🍥 Handler AFK Mention
const mentionedUsers = message.mentions.users;
if (mentionedUsers.size > 0) {
  mentionedUsers.forEach(user => {
    if (afkUsers[user.id]) {
      const afkData = afkUsers[user.id];
      const duration = Math.floor((Date.now() - afkData.timestamp) / 1000);
      
      message.reply({
        embeds: [createHeizouEmbed(
          '👀 Orang Ini Sedang AFK!',
          `<@${user.id}> sedang tidak aktif sejak **${duration} detik** lalu\n` +
          `Alasan: \`${afkData.reason}\``,
          CONFIG.DESIGN.COLORS.INFO
        )]
      });
    }
  });
}
break;

case '!tiktok': {
  const tiktokIcon = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.TIKTOK_ICON);
  message.reply({
    files: [tiktokIcon],
    embeds: [
      createHeizouEmbed(
        '📱 TikTok Resmi',
        `**Daftar akun TikTok admin**:\n` +
        `${CONFIG.DESIGN.EMOJI.LINK} **Renren**: [@ayniman4](${CONFIG.LINKS.TIKTOK_RENREN})\n` +
        `${CONFIG.DESIGN.EMOJI.LINK} **Suki na Neko Official**: [@sukinaneko](${CONFIG.LINKS.TIKTOK_SUKINANEKO})`,
        CONFIG.DESIGN.COLORS.SECONDARY
      )
      .setThumbnail('attachment://tiktok_icon.png')
      .addFields( // ✅ Hapus ... dan tambahkan field yang valid
        { 
          name: '📌 Ayniman',
          value: 'Followers: 303\nLikes: 570\nVideo: 5',
          inline: true 
        },
        { 
          name: '📌 Suki na Neko Official',
          value: 'Followers: 344\nLikes: 50\nVideo: -', 
          inline: true 
        }
      )
    ]
  });
  break;
}

case '!vbot': { // ✅ Tambahkan block scope
  const iconAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);
  message.reply({
    files: [iconAttachment], // ✅ Kirim file
    embeds: [
      createHeizouEmbed(
        '🤖 Informasi Bot',
        `**Nama Bot:** ${CONFIG.BOT.NAME}\n` +
        `**Versi:** ${CONFIG.BOT.VERSION}\n` +
        `**Developer:** <@${CONFIG.USERS.RENREN}>\n` +
        `**Bahasa Pemrograman:** JavaScript (Node.js ${process.version})\n\n` +
        `**Powered by:** Deepseek https://deepseek.com`,
        CONFIG.DESIGN.COLORS.INFO
      )
      .addFields(
        { 
          name: 'Fitur Utama', 
          value: '• AFK System\n• Admin Tools\n• Social Integration\n• Utility Commands', 
          inline: true 
        },
        { 
          name: 'Sumber Daya', 
          value: `[GitHub Repo](${CONFIG.LINKS.GITHUB})\n[Support Server](${CONFIG.LINKS.SUPPORT})`, 
          inline: true 
        }
      )
      .setThumbnail('attachment://heizou_icon.png') // ✅ Pakai attachment://
    ]
  });
  break;
}

        case '!admin': {
          // Hanya buat attachment untuk icon
          const iconAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);
        
          const adminFields = Object.values(CONFIG.USERS)
            .filter(userId => adminStatus[userId])
            .map(userId => ({
              name: `${adminStatus[userId].status}`,
              value: `${CONFIG.DESIGN.EMOJI.ADMIN} <@${userId}>\n**Jabatan:** ${adminStatus[userId].role}`,
              inline: true
            }));
        
          message.reply({
            files: [iconAttachment], // ✅ Hanya kirim icon
            embeds: [
              createHeizouEmbed(
                '🌸 Tim Administrator',
                'Daftar admin dan status terkini:',
                CONFIG.DESIGN.COLORS.PRIMARY
              )
              .setThumbnail('attachment://heizou_icon.png') // ✅ Pakai icon di thumbnail
              .addFields(adminFields)
            ]
          });
          break;
        }

          case '!giveaway':
  // Cek role admin
  if (!message.member.roles.cache.has(CONFIG.ROLES.STAFF)) {
    return message.reply({
      embeds: [createHeizouEmbed(
        'Akses Ditolak!',
        'Hanya staff yang bisa membuat giveaway',
        CONFIG.DESIGN.COLORS.ERROR
      )]
    });
  }

  const argsString = args.join(' ');
  const [duration, prize, ...rest] = argsString.split('|').map(s => s.trim());
  
  if (!duration || !prize || rest.length < 2) {
    return message.reply({
      embeds: [createHeizouEmbed(
        'Format Giveaway Salah!',
        'Contoh: `!giveaway 24h 1M Beli | Follow TikTok & Tag 3 Teman | Role Giveaway | 2023-12-31`\n' +
        '**Struktur**:\n' +
        '`!giveaway <durasi> <hadiah> | <syarat> | <jenis> | <tanggal_berakhir>`',
        CONFIG.DESIGN.COLORS.ERROR
      )]
    });
  }

  try {
    const [requirements, type, endDate] = rest;
    
    const giveawayEmbed = createHeizouEmbed(
      '🎉 **GIVEAWAY RESMI** 🎉',
      `**Host**: <@${message.author.id}>\n` +
      `**Hadiah**: ${prize}\n` +
      `**Jenis**: ${type}\n` +
      `**Berakhir Pada**: ${endDate || 'Tidak ditentukan'}`,
      CONFIG.DESIGN.COLORS.SECONDARY
    )
    .addFields(
      { name: '⏳ Durasi', value: duration, inline: true },
      { name: '📜 Persyaratan', value: requirements, inline: true }
    )
    .setImage('attachment://Gift.gif')
    .setFooter({ 
      text: `Giveaway dibuat oleh ${message.author.username}`, 
      iconURL: message.author.displayAvatarURL() 
    });

    const giveawayChannel = client.channels.cache.get(CONFIG.CHANNELS.GIVEAWAY);
    const sentMessage = await giveawayChannel.send({ 
      content: '@everyone',
      embeds: [giveawayEmbed] 
    });
    
    await sentMessage.react('🎁');
    
    message.reply({
      embeds: [createHeizouEmbed(
        'Giveaway Berhasil Dibuat! ✅',
        `Giveaway telah diposting di ${giveawayChannel}\n` +
        `➤ [Link Giveaway](${sentMessage.url})`,
        CONFIG.DESIGN.COLORS.SECONDARY
      )]
    });

  } catch (error) {
    console.error('Error membuat giveaway:', error);
    message.reply({
      embeds: [createHeizouEmbed(
        'Gagal Membuat Giveaway!',
        'Pastikan format sudah benar dan bot memiliki akses yang cukup',
        CONFIG.DESIGN.COLORS.ERROR
      )]
    });
  }
  break;

          case '!bug':
  const bugDescription = args.join(' ');
  if (!bugDescription) {
    return message.reply({
      embeds: [createHeizouEmbed(
        'Format Laporan Bug!',
        'Contoh: `!bug (deskripsi error)`\nContoh: `!bug Role tidak bisa dilepas`',
        CONFIG.DESIGN.COLORS.ERROR
      )]
    });
  }

  try {
    // Mengirim ke DM Developer
    const developer = await client.users.fetch(CONFIG.USERS.RENREN);
    await developer.send({
      embeds: [createHeizouEmbed(
        `${CONFIG.DESIGN.EMOJI.BUG} LAPORAN BUG BARU`,
        `**Pelapor**: <@${message.author.id}>\n` +
        `**Server**: ${message.guild?.name || 'DM'}\n` +
        `**Deskripsi**:\n\`\`\`${bugDescription}\`\`\``,
        CONFIG.DESIGN.COLORS.ERROR
      ).addFields(
        { 
          name: '🕒 Waktu', 
          value: `<t:${Math.floor(Date.now()/1000)}:R>`, 
          inline: true 
        },
        { 
          name: '📌 ID Laporan', 
          value: `\`${message.id.slice(-6)}\``, 
          inline: true 
        }
      )]
    });

    // Konfirmasi ke user
    message.reply({
      embeds: [createHeizouEmbed(
        'Laporan Terkirim! 📨',
        `Laporan bug telah dikirim ke DM developer\n` +
        `➤ ID Laporan: \`${message.id.slice(-6)}\``,
        CONFIG.DESIGN.COLORS.SECONDARY
      )]
    });

  } catch (error) {
    console.error('Gagal mengirim DM:', error);
    message.reply({
      embeds: [createHeizouEmbed(
        'Gagal Mengirim!',
        'Tidak bisa mengirim laporan ke developer\n' +
        'Silakan coba lagi nanti atau tag @Renren',
        CONFIG.DESIGN.COLORS.ERROR
      )]
    });
  }
  break;

      case '!status':
        if (!message.member.roles.cache.has(CONFIG.ROLES.STAFF)) {
          return message.reply({
            embeds: [createHeizouEmbed(
              'Akses Ditolak!',
              'Hanya staff yang bisa update status',
              CONFIG.DESIGN.COLORS.ERROR
            )]
          });
        }

        const newStatus = args.join(' ');
        if (!newStatus) {
          return message.reply({
            embeds: [createHeizouEmbed(
              'Format Salah!',
              'Contoh: `!status 🟢 Sedang online`',
              CONFIG.DESIGN.COLORS.ERROR
            )]
          });
        }

        adminStatus[message.author.id] = {
          ...adminStatus[message.author.id],
          status: newStatus
        };

        message.reply({
          embeds: [createHeizouEmbed(
            'Status Diperbarui! ✅',
            `Status baru: \`${newStatus}\``,
            CONFIG.DESIGN.COLORS.SECONDARY
          )]
        });
        break;

        case '!sociabuzz': {
          // 1. Buat attachment untuk icon
          const iconAttachment = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ICON);
        
          // 2. Kirim embed dengan tautan Sociabuzz
          message.reply({
            files: [iconAttachment],
            embeds: [
              createHeizouEmbed(
                '💌 Dukungan via Sociabuzz',
                `Bantu admin berkembang dengan memberikan dukungan:\n\n` +
                `${CONFIG.DESIGN.EMOJI.ADMIN} **Atun**: [Klik di sini](${CONFIG.LINKS.SOCIABUZZ.ATUN})\n` +
                `${CONFIG.DESIGN.EMOJI.ADMIN} **Renren**: [Klik di sini](${CONFIG.LINKS.SOCIABUZZ.RENREN})\n\n` +
                `➤ Status donasi: <#${CONFIG.CHANNELS.TRANSACTIONS}>`,
                CONFIG.DESIGN.COLORS.PRIMARY
              )
              .setThumbnail('attachment://heizou_icon.png')
            ]
          });
          break;
        }

      // ... command lainnya
    }
  } catch (error) {
    console.error('Error:', error);
    const errorIcon = new AttachmentBuilder(CONFIG.DESIGN.IMAGES.ERROR_ICON); // ✅
    message.reply({
      files: [errorIcon], // ✅ Kirim PNG sebagai attachment
      embeds: [
        createHeizouEmbed(
          '⚠️ Terjadi Kesalahan!',
          'Silakan coba lagi atau laporkan bug',
          CONFIG.DESIGN.COLORS.ERROR
        )
        .setThumbnail('attachment://error_icon.png') // ✅ Referensi attachment PNG
      ]
    });
  }
});

client.login(process.env.TOKEN);